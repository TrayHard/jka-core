import { EGametypes } from "../../constants";

export const gametypeNumToNamesMapper = (gametypeNum: string): EGametypes => {
  switch (gametypeNum) {
    case "0":
      return EGametypes.FFA;
    case "3":
      return EGametypes.DUEL;
    case "4":
      return EGametypes.POWER_DUEL;
    case "6":
      return EGametypes.TFFA;
    case "7":
      return EGametypes.SIEGE;
    case "8":
      return EGametypes.CTF;
    default:
      throw new Error(`Unknown g_gametype number: "${gametypeNum}"!`);
  }
}