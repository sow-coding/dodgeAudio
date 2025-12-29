export function getButtonFromUseElement (svgId: string) {
    const use = document.querySelector<SVGUseElement>(`[href="/cdn/assets/sprites-core-i9agxugi.svg#${svgId}"]`);
    if (!use) return;

    const svg = use.parentElement as SVGSVGElement | null;
    if (!svg) return;

    const button = svg.parentElement as HTMLButtonElement | null;
    if (!button) return;

    return button;
};

export function fillPromptTextarea (text: string) {
    const promptTextAreaParagraphe = document.querySelector('#prompt-textarea')?.children[0];
    if (!promptTextAreaParagraphe) return;
    
    promptTextAreaParagraphe.innerHTML = text;
}