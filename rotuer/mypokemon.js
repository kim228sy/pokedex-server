const express = require("express");
const router = express.Router();
const Idfind = require("../service/userService/idsearch");
const { catchPoke } = require("../service/mypokemonService/pokeCatch");
const Mypokemoninfo = require("../service/mypokemonService/mypokemon");
const tokenUtil = require("../lib/tokenUtil");
//포켓몬 잡으면 mypokemondb에 저장
router.post("/catchpoke", isLoggedIn, async (req, res) => {
  try {
    const tokenbearer = req.headers.authorization;
    const token = tokenbearer.substring(7);
    const useremail = tokenUtil.verifyToken(token).email;
    const userid = await Idfind(useremail);
    const pokeid = req.body.pokeid;
    const result = await catchPoke(userid, pokeid);
    if (result instanceof Error) throw result;
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
//내가 잡은 포켓몬들 보여주기
router.get("/mypokemon", isLoggedIn, async (req, res) => {
  try {
    const tokenbearer = req.headers.authorization;
    const token = tokenbearer.substring(7);
    const myemail = tokenUtil.verifyToken(token).email;
    const myinfo = await informSearch(myemail);
    const myid = myinfo.id;
    const pokemons = await Mypokemoninfo(myid);
    const pokeIds = pokemons.map((item) => item.pokeid);
    res.status(200).json(pokeIds);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;