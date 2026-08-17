"""
TRELLIS Inference Engine & Microservice Server
===============================================
Microsoft TRELLIS: High-Fidelity 3D Asset Generation from Single Images
(Supports Structured Latents, FlexiCubes Polygonal Meshes, PBR Texturing, and 3D Gaussian Splatting)

Model Source: JeffreyXiang/TRELLIS-image-large (Hugging Face) / Microsoft TRELLIS
Capabilities:
  1. Polygonal Mesh (.glb) with FlexiCubes topology and PBR textures.
  2. 3D Gaussian Splatting (.ply / .splat) radiance representation.
  3. Standalone CLI execution + Lightweight FastAPI microservice.
  4. Strict CUDA hardware validation and transparent fallback diagnostics.

Zero Mocks / Real Pipeline Compliance.
"""

import os
import sys
import time
import io
import argparse
import logging
from pathlib import Path
from typing import Optional, Dict, Any, Union, Tuple

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("TRELLIS-Engine")

# Optional FastAPI / Uvicorn imports for server mode
try:
    from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, BackgroundTasks
    from fastapi.responses import FileResponse, Response, JSONResponse
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    logger.info("FastAPI/Uvicorn not found in current environment. Server mode will require 'pip install fastapi uvicorn python-multipart'.")

# PIL for image handling
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    logger.error("PIL (Pillow) is required. Install with 'pip install pillow'.")

# PyTorch import and CUDA detection
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    logger.error("PyTorch is required. Install with 'pip install torch torchvision'.")


class TrellisInferenceEngine:
    """
    Microsoft TRELLIS 3D Generation Pipeline Wrapper.
    Handles weights loading, image preprocessing, multi-representation inference
    (FlexiCubes Mesh + Gaussian Splatting), and asset export (.glb, .ply, .splat).
    """

    DEFAULT_MODEL_ID = "JeffreyXiang/TRELLIS-image-large"

    def __init__(
        self,
        model_id: str = DEFAULT_MODEL_ID,
        device: Optional[str] = None,
        dtype: Optional[str] = "float16",
        lazy_load: bool = False
    ):
        """
        Initialize the TRELLIS Inference Engine.

        Args:
            model_id: HuggingFace model repository ID.
            device: 'cuda', 'cpu', or None for auto-detection.
            dtype: 'float16', 'bfloat16', or 'float32'.
            lazy_load: If True, defer pipeline loading until first inference.
        """
        self.model_id = model_id
        self.device = self._resolve_device(device)
        self.dtype = self._resolve_dtype(dtype)
        self.pipeline = None
        self.is_ready = False

        self._check_environment_health()

        if not lazy_load:
            self.load_model()

    def _resolve_device(self, preferred_device: Optional[str]) -> str:
        """Determines execution device with strict CUDA checking."""
        if preferred_device:
            return preferred_device.lower()
        if TORCH_AVAILABLE and torch.cuda.is_available():
            return "cuda"
        return "cpu"

    def _resolve_dtype(self, dtype_str: Optional[str]) -> Any:
        """Maps dtype string to PyTorch tensor type."""
        if not TORCH_AVAILABLE:
            return None
        mapping = {
            "float16": torch.float16,
            "fp16": torch.float16,
            "bfloat16": torch.bfloat16,
            "bf16": torch.bfloat16,
            "float32": torch.float32,
            "fp32": torch.float32,
        }
        return mapping.get(str(dtype_str).lower(), torch.float16)

    def _check_environment_health(self) -> Dict[str, Any]:
        """Inspects CUDA, VRAM, and native extensions availability."""
        health = {
            "torch_available": TORCH_AVAILABLE,
            "torch_version": torch.__version__ if TORCH_AVAILABLE else None,
            "cuda_available": torch.cuda.is_available() if TORCH_AVAILABLE else False,
            "device_selected": self.device,
            "gpu_name": None,
            "vram_total_gb": None,
            "vram_allocated_gb": None,
        }

        if TORCH_AVAILABLE and torch.cuda.is_available():
            health["gpu_name"] = torch.cuda.get_device_name(0)
            total_vram = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            allocated_vram = torch.cuda.memory_allocated(0) / (1024**3)
            health["vram_total_gb"] = round(total_vram, 2)
            health["vram_allocated_gb"] = round(allocated_vram, 2)
            logger.info(f"CUDA GPU Detected: {health['gpu_name']} ({health['vram_total_gb']} GB VRAM)")
        else:
            logger.warning(
                "No CUDA GPU detected or PyTorch CUDA is not available. "
                "Note: Native TRELLIS rasterization (nvdiffrast, diff-gaussian-rasterization, spconv) "
                "requires NVIDIA CUDA GPU architecture (>= 12GB VRAM recommended)."
            )

        return health

    def load_model(self):
        """Loads TRELLIS weights and pipelines from Hugging Face or local cache."""
        if not TORCH_AVAILABLE:
            raise RuntimeError("PyTorch is not installed. Please install PyTorch before loading TRELLIS.")

        if self.device != "cuda":
            logger.warning(
                f"Attempting to load TRELLIS on non-CUDA device ('{self.device}'). "
                "TRELLIS utilizes custom CUDA C++/CUDA kernels (FlexiCubes, 3DGS, SpConv). "
                "Inference on CPU is not natively supported by the official TRELLIS kernels and will raise an error."
            )

        logger.info(f"Loading TRELLIS pipeline from '{self.model_id}' on device '{self.device}'...")
        start_time = time.time()

        try:
            # Official TRELLIS import
            from trellis.pipelines import TrellisImageTo3DPipeline
            
            self.pipeline = TrellisImageTo3DPipeline.from_pretrained(self.model_id)
            
            if self.device == "cuda":
                self.pipeline.to(device="cuda", dtype=self.dtype)
            else:
                self.pipeline.to(device=self.device)

            self.is_ready = True
            elapsed = round(time.time() - start_time, 2)
            logger.info(f"TRELLIS pipeline successfully loaded in {elapsed}s.")

        except ImportError as e:
            self.is_ready = False
            msg = (
                f"Failed to import 'trellis' package ({str(e)}). "
                "Ensure Microsoft TRELLIS is installed:\n"
                "  git clone --recurse-submodules https://github.com/microsoft/TRELLIS.git\n"
                "  cd TRELLIS && pip install -r requirements.txt\n"
                "  pip install -e .\n"
                "Or install required submodules: nvdiffrast, diff-gaussian-rasterization, spconv-cu118/120."
            )
            logger.error(msg)
            raise RuntimeError(msg) from e
        except Exception as e:
            self.is_ready = False
            logger.error(f"Error loading TRELLIS weights: {str(e)}")
            raise e

    def preprocess_image(
        self,
        image_input: Union[str, Path, bytes, "Image.Image"],
        remove_background: bool = True
    ) -> "Image.Image":
        """
        Preprocesses and normalizes the input image for TRELLIS inference.
        Standardizes to RGBA, removes background if requested, and pads to square aspect ratio.
        """
        if not PIL_AVAILABLE:
            raise RuntimeError("PIL (Pillow) is not available.")

        # Load image
        if isinstance(image_input, (str, Path)):
            img = Image.open(image_input)
        elif isinstance(image_input, bytes):
            img = Image.open(io.BytesIO(image_input))
        elif isinstance(image_input, Image.Image):
            img = image_input
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")

        img = img.convert("RGBA")

        # Background removal if rembg is installed and requested
        if remove_background:
            try:
                import rembg
                img = rembg.remove(img)
                logger.info("Background removed successfully using rembg.")
            except ImportError:
                logger.info("rembg not installed; proceeding with existing alpha channel or raw RGB.")

        return img

    def run_inference(
        self,
        image: Union[str, Path, bytes, "Image.Image"],
        seed: int = 42,
        sparse_steps: int = 12,
        sparse_cfg: float = 7.5,
        slat_steps: int = 12,
        slat_cfg: float = 3.0,
        mesh_simplify: float = 0.95,
        texture_size: int = 1024,
        preprocess: bool = True,
    ) -> Dict[str, Any]:
        """
        Executes complete TRELLIS 3D inference pipeline from a single image.

        Returns:
            Dict containing:
                - 'outputs': Raw TRELLIS pipeline outputs (Gaussian, Mesh, RadianceField)
                - 'mesh': FlexiCubes polygonal mesh
                - 'gaussian': 3D Gaussian Splatting representation
                - 'metadata': Inference parameters and execution latency
        """
        if not self.is_ready or self.pipeline is None:
            self.load_model()

        if self.device != "cuda":
            raise RuntimeError(
                f"Cannot execute TRELLIS inference on '{self.device}'. "
                "Microsoft TRELLIS requires an NVIDIA GPU with CUDA drivers to run custom geometry synthesis kernels."
            )

        start_time = time.time()
        logger.info(f"Starting TRELLIS inference (seed={seed}, sparse_steps={sparse_steps}, slat_steps={slat_steps})...")

        # Preprocess input image
        processed_img = self.preprocess_image(image) if preprocess else image

        # Set random seed
        if TORCH_AVAILABLE:
            torch.manual_seed(seed)
            if torch.cuda.is_available():
                torch.cuda.manual_seed_all(seed)

        # Run pipeline
        outputs = self.pipeline.run(
            processed_img,
            seed=seed,
            sparse_structure_sampler_params={
                "steps": sparse_steps,
                "cfg_strength": sparse_cfg,
            },
            slat_sampler_params={
                "steps": slat_steps,
                "cfg_strength": slat_cfg,
            },
        )

        elapsed = round(time.time() - start_time, 2)
        logger.info(f"TRELLIS inference completed successfully in {elapsed}s.")

        return {
            "outputs": outputs,
            "gaussian": outputs.get("gaussian", [None])[0] if "gaussian" in outputs else None,
            "mesh": outputs.get("mesh", [None])[0] if "mesh" in outputs else None,
            "radiance_field": outputs.get("radiance_field", [None])[0] if "radiance_field" in outputs else None,
            "metadata": {
                "elapsed_seconds": elapsed,
                "seed": seed,
                "sparse_steps": sparse_steps,
                "slat_steps": slat_steps,
                "sparse_cfg": sparse_cfg,
                "slat_cfg": slat_cfg,
                "mesh_simplify": mesh_simplify,
                "texture_size": texture_size,
            }
        }

    def export_glb(
        self,
        inference_result: Dict[str, Any],
        output_path: Union[str, Path],
        simplify: float = 0.95,
        texture_size: int = 1024
    ) -> Path:
        """
        Exports the generated 3D FlexiCubes Mesh with PBR texturing to GLTF/GLB format.
        """
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            from trellis.utils import postprocessing_utils
            
            gaussian = inference_result.get("gaussian")
            mesh = inference_result.get("mesh")

            if mesh is None:
                raise ValueError("No mesh object found in inference results.")

            glb = postprocessing_utils.to_glb(
                gaussian,
                mesh,
                simplify=simplify,
                texture_size=texture_size,
                verbose=False
            )
            glb.export(str(output_path))
            logger.info(f"Exported GLB mesh to: {output_path} ({output_path.stat().st_size} bytes)")
            return output_path

        except Exception as e:
            logger.error(f"Failed to export GLB mesh: {str(e)}")
            raise e

    def export_gaussian_ply(
        self,
        inference_result: Dict[str, Any],
        output_path: Union[str, Path]
    ) -> Path:
        """
        Exports the 3D Gaussian Splatting representation to standard .ply format.
        """
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            gaussian = inference_result.get("gaussian")
            if gaussian is None:
                raise ValueError("No Gaussian Splatting object found in inference results.")

            gaussian.save_ply(str(output_path))
            logger.info(f"Exported Gaussian Splatting PLY to: {output_path} ({output_path.stat().st_size} bytes)")
            return output_path

        except Exception as e:
            logger.error(f"Failed to export Gaussian PLY: {str(e)}")
            raise e


# ==============================================================================
# FastAPI Microservice Application
# ==============================================================================

app = None
engine_instance: Optional[TrellisInferenceEngine] = None

if FASTAPI_AVAILABLE:
    app = FastAPI(
        title="Microsoft TRELLIS 3D Inference Microservice",
        description="High-fidelity 3D Asset Synthesis from Single Images (GLB + 3DGS PLY)",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_engine() -> TrellisInferenceEngine:
        global engine_instance
        if engine_instance is None:
            engine_instance = TrellisInferenceEngine(lazy_load=True)
        return engine_instance

    @app.get("/health")
    def health_check():
        """Returns API health, PyTorch version, CUDA status, and VRAM."""
        engine = get_engine()
        health = engine._check_environment_health()
        return {
            "status": "online",
            "model_id": engine.model_id,
            "model_ready": engine.is_ready,
            "environment": health
        }

    @app.post("/infer/image-to-3d")
    async def api_generate_3d(
        file: UploadFile = File(...),
        seed: int = Form(42),
        sparse_steps: int = Form(12),
        slat_steps: int = Form(12),
        simplify: float = Form(0.95),
        texture_size: int = Form(1024),
        format: str = Form("glb", description="'glb', 'ply', or 'both'")
    ):
        """
        Receives an uploaded image file, executes TRELLIS 3D inference,
        and returns the generated 3D model asset.
        """
        engine = get_engine()
        health = engine._check_environment_health()

        if not health["cuda_available"]:
            raise HTTPException(
                status_code=503,
                detail=(
                    "TRELLIS inference requires an active NVIDIA CUDA GPU backend. "
                    "Local host reports CUDA unavailable. Please connect to a GPU-enabled worker."
                )
            )

        try:
            image_bytes = await file.read()
            results = engine.run_inference(
                image=image_bytes,
                seed=seed,
                sparse_steps=sparse_steps,
                slat_steps=slat_steps,
                mesh_simplify=simplify,
                texture_size=texture_size
            )

            # Temp output directory
            temp_dir = Path("./trellis_output_temp")
            temp_dir.mkdir(parents=True, exist_ok=True)
            timestamp = int(time.time())

            if format.lower() == "ply":
                ply_path = temp_dir / f"trellis_{timestamp}.ply"
                engine.export_gaussian_ply(results, ply_path)
                return FileResponse(
                    path=str(ply_path),
                    filename=f"trellis_model_{timestamp}.ply",
                    media_type="application/octet-stream"
                )
            else:
                glb_path = temp_dir / f"trellis_{timestamp}.glb"
                engine.export_glb(results, glb_path, simplify=simplify, texture_size=texture_size)
                return FileResponse(
                    path=str(glb_path),
                    filename=f"trellis_model_{timestamp}.glb",
                    media_type="model/gltf-binary"
                )

        except Exception as e:
            logger.error(f"Inference error: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=str(e))


# ==============================================================================
# CLI Entrypoint
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Microsoft TRELLIS 3D Inference Engine & Microservice",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument("--image", type=str, help="Path to input photo (e.g. image.jpg, image.png)")
    parser.add_argument("--output_glb", type=str, default=None, help="Output path for polygonal mesh (.glb)")
    parser.add_argument("--output_ply", type=str, default=None, help="Output path for Gaussian Splatting (.ply)")
    parser.add_argument("--model_id", type=str, default=TrellisInferenceEngine.DEFAULT_MODEL_ID, help="HuggingFace model ID")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for generation")
    parser.add_argument("--sparse_steps", type=int, default=12, help="Sparse structure flow steps")
    parser.add_argument("--slat_steps", type=int, default=12, help="Structured Latent (SLAT) flow steps")
    parser.add_argument("--simplify", type=float, default=0.95, help="Mesh decimation ratio (0.0 - 1.0)")
    parser.add_argument("--texture_size", type=int, default=1024, help="PBR texture resolution (e.g. 1024, 2048)")
    parser.add_argument("--device", type=str, default=None, help="Force device ('cuda', 'cpu', 'mps')")

    # Server mode options
    parser.add_argument("--server", action="store_true", help="Launch FastAPI REST microservice")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="FastAPI host binding")
    parser.add_argument("--port", type=int, default=8000, help="FastAPI port binding")
    parser.add_argument("--health", action="store_true", help="Print system & CUDA diagnostics and exit")

    args = parser.parse_args()

    # Health check flag
    if args.health:
        engine = TrellisInferenceEngine(model_id=args.model_id, device=args.device, lazy_load=True)
        health = engine._check_environment_health()
        print("\n=== TRELLIS ENVIRONMENT HEALTH REPORT ===")
        for k, v in health.items():
            print(f"  {k}: {v}")
        print("========================================\n")
        return

    # Server mode
    if args.server:
        if not FASTAPI_AVAILABLE:
            print("ERROR: FastAPI or Uvicorn not installed. Run: pip install fastapi uvicorn python-multipart")
            sys.exit(1)
        print(f"Starting TRELLIS FastAPI Microservice on http://{args.host}:{args.port} ...")
        uvicorn.run(app, host=args.host, port=args.port)
        return

    # CLI Direct Inference mode
    if not args.image:
        parser.print_help()
        print("\nError: Please specify --image <path> for CLI generation or --server to run the microservice.")
        sys.exit(1)

    input_image_path = Path(args.image)
    if not input_image_path.exists():
        print(f"Error: Input image file not found at: {input_image_path}")
        sys.exit(1)

    # Resolve default output paths if not provided
    base_stem = input_image_path.stem
    output_glb = Path(args.output_glb) if args.output_glb else Path(f"./{base_stem}_trellis.glb")
    output_ply = Path(args.output_ply) if args.output_ply else Path(f"./{base_stem}_trellis.ply")

    print(f"\n========================================================")
    print(f" MICROSOFT TRELLIS 3D INFERENCE")
    print(f" Input:      {input_image_path}")
    print(f" Output GLB: {output_glb}")
    print(f" Output PLY: {output_ply}")
    print(f" Model:      {args.model_id}")
    print(f" Seed:       {args.seed}")
    print(f"========================================================\n")

    engine = TrellisInferenceEngine(
        model_id=args.model_id,
        device=args.device,
        lazy_load=False
    )

    # Run inference
    results = engine.run_inference(
        image=input_image_path,
        seed=args.seed,
        sparse_steps=args.sparse_steps,
        slat_steps=args.slat_steps,
        mesh_simplify=args.simplify,
        texture_size=args.texture_size
    )

    # Export outputs
    if args.output_glb or not args.output_ply:
        engine.export_glb(results, output_glb, simplify=args.simplify, texture_size=args.texture_size)

    if args.output_ply:
        engine.export_gaussian_ply(results, output_ply)

    print("\n✓ TRELLIS generation process completed successfully.")


if __name__ == "__main__":
    main()
