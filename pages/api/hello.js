export default async function handler(req, res) {
  return res.status(200).json({ Message: "Reached the SINO endpoint" });
}
