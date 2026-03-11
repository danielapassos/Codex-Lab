const PLACEHOLDER_JOIN_FORM_URL = "https://example.com/forms/codex-lab-interest";

export function getJoinFormConfig() {
  const url = process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim() || PLACEHOLDER_JOIN_FORM_URL;

  return {
    url,
    isPlaceholder: url === PLACEHOLDER_JOIN_FORM_URL,
  };
}

export { PLACEHOLDER_JOIN_FORM_URL };
