export function armyPassCaption(configuredUrl?: string) {
  const text = `💜 Meu ARMY PASS está pronto!

Escolhi minha era favorita do BTS e criei meu passaporte personalizado no ARMY PASS BRASIL! ✨

Crie o seu também e compartilhe com a gente!

💜 @meuuniversobts
💻 @fernandev.tech

#ArmyPassBrasil #BTS #BTSARMY`;
  if (!configuredUrl) return text;
  try {
    const url = new URL(configuredUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]"
    )
      return text;
    return `${text}\n\n${url.href}`;
  } catch {
    return text;
  }
}

export function armyPassShareData(
  file: File,
  caption: string,
  canShare: (data: ShareData) => boolean,
): ShareData {
  const data = { files: [file], title: "Meu Army Pass Brasil" };
  try {
    const withText = { ...data, text: caption };
    if (canShare({ text: caption }) && canShare(withText)) return withText;
  } catch {
    // Keep file sharing available when optional text cannot be validated.
  }
  return data;
}
