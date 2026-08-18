/**
 * src/core/services/mascotSpatialRegistry.ts
 * Escaneo, indexación y cálculo geométrico de objetivos DOM interactivos
 */

import { SpatialTargetNode, SpatialAnchorPosition } from '../types/mascotSpatial';

export class MascotSpatialRegistry {
  private static readonly ATTRIBUTE_NAME = 'data-mascot-target';
  private static readonly ANCHOR_ATTR = 'data-mascot-anchor';
  private static readonly LABEL_ATTR = 'data-mascot-label';
  private static readonly HINT_ATTR = 'data-mascot-hint';

  /**
   * Escanea activamente el DOM en busca de nodos registrados
   */
  public static scanTargets(): SpatialTargetNode[] {
    if (typeof document === 'undefined') return [];

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(`[${this.ATTRIBUTE_NAME}]`)
    );

    return elements.map((el) => {
      const id = el.getAttribute(this.ATTRIBUTE_NAME) || 'unknown';
      const label = el.getAttribute(this.LABEL_ATTR) || id;
      const hint = el.getAttribute(this.HINT_ATTR) || undefined;
      const preferredAnchor = (el.getAttribute(this.ANCHOR_ATTR) as SpatialAnchorPosition) || 'top-right';
      const rect = el.getBoundingClientRect();

      return {
        id,
        label,
        hint,
        element: el,
        rect,
        preferredAnchor,
        category: (el.dataset.mascotCategory as any) || 'tool',
      };
    });
  }

  /**
   * Obtiene un objetivo específico por su ID
   */
  public static getTarget(targetId: string): SpatialTargetNode | null {
    if (typeof document === 'undefined') return null;

    const el = document.querySelector<HTMLElement>(`[${this.ATTRIBUTE_NAME}="${targetId}"]`);
    if (!el) return null;

    return {
      id: targetId,
      label: el.getAttribute(this.LABEL_ATTR) || targetId,
      hint: el.getAttribute(this.HINT_ATTR) || undefined,
      element: el,
      rect: el.getBoundingClientRect(),
      preferredAnchor: (el.getAttribute(this.ANCHOR_ATTR) as SpatialAnchorPosition) || 'top-right',
      category: (el.dataset.mascotCategory as any) || 'tool',
    };
  }

  /**
   * Calcula las coordenadas de pantalla exactas para anclar la mascota al borde del elemento,
   * con evasión automática de bordes de pantalla (viewport collision flipping).
   */
  public static calculateAnchorCoords(
    targetRect: DOMRect,
    anchor: SpatialAnchorPosition,
    mascotW: number = 76,
    mascotH: number = 76,
    margin: number = 12
  ): { x: number; y: number; effectiveAnchor: SpatialAnchorPosition } {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    let x = targetRect.right - mascotW;
    let y = targetRect.top - mascotH - margin;
    let effectiveAnchor = anchor;

    switch (anchor) {
      case 'top-left':
        x = targetRect.left;
        y = targetRect.top - mascotH - margin;
        break;
      case 'top-center':
        x = targetRect.left + targetRect.width / 2 - mascotW / 2;
        y = targetRect.top - mascotH - margin;
        break;
      case 'top-right':
        x = targetRect.right - mascotW;
        y = targetRect.top - mascotH - margin;
        break;
      case 'right-center':
        x = targetRect.right + margin;
        y = targetRect.top + targetRect.height / 2 - mascotH / 2;
        break;
      case 'bottom-right':
        x = targetRect.right - mascotW;
        y = targetRect.bottom + margin;
        break;
      case 'bottom-center':
        x = targetRect.left + targetRect.width / 2 - mascotW / 2;
        y = targetRect.bottom + margin;
        break;
      case 'bottom-left':
        x = targetRect.left;
        y = targetRect.bottom + margin;
        break;
      case 'left-center':
        x = targetRect.left - mascotW - margin;
        y = targetRect.top + targetRect.height / 2 - mascotH / 2;
        break;
    }

    if (y < 12) {
      if (anchor.startsWith('top')) {
        y = targetRect.bottom + margin;
        effectiveAnchor = anchor.replace('top', 'bottom') as SpatialAnchorPosition;
      } else {
        y = 12;
      }
    }

    if (x + mascotW > vw - 12) {
      x = vw - mascotW - 12;
    }

    if (x < 12) {
      x = 12;
    }

    if (y + mascotH > vh - 12) {
      y = vh - mascotH - 12;
    }

    return { x, y, effectiveAnchor };
  }

  /**
   * Genera el mapa de conocimiento espacial formateado para el System Prompt del LLM
   */
  public static generateSpatialContextPrompt(): string {
    const targets = this.scanTargets();
    if (targets.length === 0) return '';

    const list = targets
      .map(
        (t) =>
          `- [ID: "${t.id}"] ${t.label}${t.hint ? ` (${t.hint})` : ''} -> Posición visible: ${t.rect.top > 0 && t.rect.top < window.innerHeight ? 'En pantalla' : 'Requiere Scroll'}`
      )
      .join('\n');

    return `\nZONAS INTERACTIVAS DISPONIBLES EN LA PANTALLA ACTUAL:\n${list}\nSi el usuario solicita interactuar con una de estas zonas, puedes invocar la navegación espacial hacia su ID correspondiente.`;
  }
}
