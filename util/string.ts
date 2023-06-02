export function toPrettyKST(ISOString: string) {
  const [ymd, hmsm] = ISOString.split('T');
  const hms = hmsm.split('.').at(0);
  return `${ymd} ${hms}`;
}

