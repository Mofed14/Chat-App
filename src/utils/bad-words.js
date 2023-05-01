const words = [
  "كس أمك",
  "يا ابن الشرموطة",
  "الشرموطة",
  "شرموطة",
  "شرموطه",
  "شرموط",
  "علق",
  "علقه",
  "علقة",
  "خول",
  "لبوه",
  "لبوة",
  "متناك",
  "متناكة",
  "متناكة",
  "عرص",
  "معرص",
  "خول",
  "منيوك",
  "منيوكه",
  "منيوكة",
];

const badWordsInArabic = (word) => {
  if (words.includes(word)) return "This is very bad word";
};

module.exports = { badWordsInArabic };
