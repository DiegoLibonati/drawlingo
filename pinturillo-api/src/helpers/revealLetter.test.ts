import { revealLetter } from "@src/helpers/revealLetter";
import { getRandomIndex } from "@src/helpers/getRandomIndex";
import { replaceChar } from "@src/helpers/replaceChar";

jest.mock("@src/helpers/getRandomIndex");
jest.mock("@src/helpers/replaceChar");

beforeEach(() => {
  jest.clearAllMocks();
});

test("It should reveal a letter in the word placeholder.", async () => {
  (getRandomIndex as jest.Mock).mockReturnValue(0);
  (replaceChar as jest.Mock).mockReturnValue("HELLO");

  const word = "HELLO";
  const wordPlaceholder = "_____";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("H E L L O");
  expect(getRandomIndex).toHaveBeenCalledWith(word);
  expect(replaceChar).toHaveBeenCalledWith("_____", "H", 0);
});

test("It should handle words with spaces.", async () => {
  (getRandomIndex as jest.Mock).mockReturnValue(0);
  (replaceChar as jest.Mock).mockReturnValue("HELLO");

  const word = "HELLO";
  const wordPlaceholder = "_ _ _ _ _";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("H E L L O");
  expect(getRandomIndex).toHaveBeenCalledWith(word);
  expect(replaceChar).toHaveBeenCalledWith("_____", "H", 0);
});

test("It should return fully revealed word when placeholder matches word.", async () => {
  const word = "HELLO";
  const wordPlaceholder = "HELLO";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("H E L L O");
  expect(getRandomIndex).toHaveBeenCalledWith(word);
  expect(replaceChar).not.toHaveBeenCalled();
});

test("It should try different index if letter is already revealed.", async () => {
  (getRandomIndex as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(1);

  (replaceChar as jest.Mock).mockReturnValue("HELLO");

  const word = "HELLO";
  const wordPlaceholder = "H____";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("H E L L O");
  expect(getRandomIndex).toHaveBeenCalledTimes(2);
  expect(replaceChar).toHaveBeenCalledWith("H____", "E", 1);
});

test("It should handle empty strings.", async () => {
  const word = "";
  const wordPlaceholder = "";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("");
  expect(getRandomIndex).toHaveBeenCalledWith(word);
});

test("It should handle different length inputs.", async () => {
  (getRandomIndex as jest.Mock).mockReturnValue(0);
  (replaceChar as jest.Mock).mockReturnValue("HELL");

  const word = "HELLO";
  const wordPlaceholder = "____";

  const result = await revealLetter(word, wordPlaceholder);

  expect(result).toBe("H E L L");
  expect(getRandomIndex).toHaveBeenCalledWith(word);
  expect(replaceChar).toHaveBeenCalled();
});
