export default function profileName(displayName: string, email: string): string {
  const name = displayName.trim();
  if (name) {
    return name;
  }
  const localPart = email.split('@', 1)[0]?.trim();
  return localPart || 'Player';
}
