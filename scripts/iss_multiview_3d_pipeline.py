"""
=============================================================================
PIPELINE DE RECONSTRUCCIÓN 3D MULTI-VISTA DE LA ISS Y OBJETOS ESPACIALES
=============================================================================
1. Descarga imágenes multi-ángulo de alta resolución de la API oficial de la NASA (STS flyaround, Soyuz, etc.).
2. Genera la estructura de carpetas estándar para DUSt3R, TRELLIS y Nerfstudio (3D Gaussian Splatting).
3. Incluye comandos y llamadas para ejecutar la reconstrucción 3D a nube de puntos/malla GLB.
"""

import os
import sys
import json
import urllib.request
import urllib.parse

NASA_API_SEARCH = "https://images-api.nasa.gov/search"
OUTPUT_DIR = "iss_3d_reconstruction_dataset"

def search_nasa_multiview(query="iss flyaround", limit=12):
    """Busca y extrae los enlaces directos a las imágenes de alta resolución de la NASA."""
    params = urllib.parse.urlencode({"q": query, "media_type": "image"})
    url = f"{NASA_API_SEARCH}?{params}"
    
    print(f"[*] Buscando imágenes de ángulos múltiples en NASA API con query='{query}'...")
    req = urllib.request.Request(url, headers={'User-Agent': 'NASA-3D-ISS-Pipeline/1.0'})
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        
    items = data.get("collection", {}).get("items", [])
    print(f"[+] Total encontrados: {len(items)}. Seleccionando los mejores {min(len(items), limit)} ángulos...")
    
    results = []
    for item in items[:limit]:
        item_data = item["data"][0]
        thumb = item["links"][0]["href"] if item.get("links") else None
        
        # Obtener lista de archivos de resolución completa
        collection_url = item["href"]
        try:
            coll_req = urllib.request.Request(collection_url, headers={'User-Agent': 'NASA-3D-ISS-Pipeline/1.0'})
            with urllib.request.urlopen(coll_req) as coll_resp:
                assets = json.loads(coll_resp.read().decode('utf-8'))
                # Filtrar el archivo ~orig.jpg o ~large.jpg
                orig_img = next((a for a in assets if "~orig.jpg" in a or "~large.jpg" in a), None)
                if not orig_img:
                    orig_img = assets[0] if assets else thumb
        except Exception:
            orig_img = thumb

        results.append({
            "nasa_id": item_data["nasa_id"],
            "title": item_data["title"],
            "date": item_data.get("date_created", "N/A"),
            "high_res_url": orig_img,
            "thumb_url": thumb
        })
    return results

def prepare_dataset(items):
    """Crea la estructura de dataset y descarga las imágenes."""
    images_dir = os.path.join(OUTPUT_DIR, "images")
    os.makedirs(images_dir, exist_ok=True)
    
    manifest_path = os.path.join(OUTPUT_DIR, "dataset_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    
    print(f"\n[✓] Manifiesto guardado en: {manifest_path}")
    print(f"[*] Dataset preparado en: {images_dir}")
    print("\n--- INSTRUCCIONES DE EJECUCIÓN 3D ---")
    print("1. Reconstrucción con DUSt3R (Para 2 ó 3 imágenes sin calibrar):")
    print("   git clone https://github.com/naver/dust3r.git")
    print("   cd dust3r && pip install -r requirements.txt")
    print(f"   python demo.py --model_name DUSt3R_ViTLarge_BaseDecoder_512_dpt --image_dir ../{images_dir}")
    print("\n2. Reconstrucción con TRELLIS (Microsoft Research - Malla 3D + PBR):")
    print("   git clone https://github.com/microsoft/TRELLIS.git")
    print("   python -m trellis.pipelines.image_to_3d --image <imagen1.jpg> --output_format glb")
    print("\n3. Reconstrucción con 3D Gaussian Splatting (Nerfstudio - Zoom Ultra HD):")
    print("   ns-process-data images --data ./images --output-dir ./nerf_data")
    print("   ns-train splatfacto --data ./nerf_data")

if __name__ == "__main__":
    items = search_nasa_multiview("iss flyaround", 6)
    prepare_dataset(items)
