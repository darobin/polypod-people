
import { customAlphabet } from "nanoid";
import lowercase from "nanoid-dictionary/lowercase.js";

const nanoid = customAlphabet(lowercase);

export default nanoid;
