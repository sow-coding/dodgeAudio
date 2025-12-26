export function getButtonFromUseElement (hrefValue: string) {
    const use = document.querySelector<SVGUseElement>(`[href="${hrefValue}"]`);
    if (!use) return;

    const svg = use.parentElement as SVGSVGElement | null;
    if (!svg) return;

    const button = svg.parentElement as HTMLButtonElement | null;
    if (!button) return;

    return button;
};
