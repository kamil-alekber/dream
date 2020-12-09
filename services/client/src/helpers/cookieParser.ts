export function cookieParser(headers: Record<string, any>) {
  const prepareCookie = headers.cookie?.split('; ');
  const cookieMap: Record<string, string> = {};

  prepareCookie?.forEach((el) => {
    const splitted = el.split('=');
    cookieMap[splitted[0]] = splitted[1];
  });

  return cookieMap;
}
