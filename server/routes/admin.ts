import * as express from 'express';
import Beer from '../models/beers';
import User from '../models/user';
import * as Sequelize from 'sequelize';
import Report from '../models/report';

const router = express.Router();

//----------------------------------------------Beer
router.get('/beerlist', async (req, res) => {
  try {
    console.log('::::::get /beerlist::::::::', req.url);
    const { url } = req;
    const limitArr: RegExpMatchArray | null = url.match(/limit=(\d+(\d)*)/);
    const pageArr: RegExpMatchArray | null = url.match(/page=(\d+(\d)*)/);
    const targetArr: RegExpMatchArray | null = url.match(/orderBy=(\w+(\w)*)/);
    const sortArr: RegExpMatchArray | null = url.match(/orderDir=(\w+(\w)*)/);
    if (targetArr && sortArr && limitArr && pageArr) {
      const limit = Number(limitArr[1]);
      const page = Number(pageArr[1]);
      const start = limit * page - limit + 1;
      const end = limit * page;
      const target = String(targetArr[1]);
      const sort = String(sortArr[1]);

      // const limit = Number(url.slice(16)[0] + url.slice(16)[1]);
      // const page = Number(url.slice(24)[0]);
      // const start = limit * page - limit + 1;
      // const end = limit * page;
      const allBeerList = await Beer.findAll({
        raw: true,
      });

      const sendBeerList = await Beer.findAll({
        raw: true,
        where: {
          id: {
            [Sequelize.Op.between]: [start, end],
          },
        },
        order: [[target, sort]],
      });

      // const delay = setTimeout(function(){
      //     res.status(200).json(sendAllBeerList)
      // }, 5000)

      const total = String(allBeerList.length);
      if (allBeerList) {
        res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        res.set('X-Total-Count', total);
        return res.status(200).json(sendBeerList);
      }
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

//----------------------------------------------------Create Beer
router.post('/beerlist', async (req, res) => {
  try {
    const {
      beer_name,
      beer_name_en,
      search_word,
      beer_img,
      abv,
      ibu,
      style_id,
      company_id,
      country_id,
      story,
      explain,
      source,
      poster,
    } = req.body;

    await Beer.create({
      beer_name,
      beer_name_en,
      search_word,
      beer_img,
      abv,
      ibu,
      style_id,
      company_id,
      country_id,
      story,
      explain,
      source,
      poster,
    });
    res.status(201).send('create');
  } catch (e) {
    return res.sendStatus(500);
  }
});
//----------------------------------------------------Update Beer
router.put('/beerlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      beer_name,
      beer_name_en,
      search_word,
      beer_img,
      abv,
      ibu,
      style_id,
      company_id,
      country_id,
      story,
      explain,
      source,
      poster,
    } = req.body;

    await Beer.update(
      {
        beer_name,
        beer_name_en,
        search_word,
        beer_img,
        abv,
        ibu,
        style_id,
        company_id,
        country_id,
        story,
        explain,
        source,
        poster,
      },
      {
        where: { id },
      }
    );
    res.status(200).send('update');
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.get('/beerlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Beer.findOne({ where: { id } });
    res.status(200).json(data);
  } catch (e) {
    return res.sendStatus(500);
  }
});

//-------------------------------------------------------User
router.get('/userlist', async (req, res) => {
  try {
    const { url } = req;
    console.log(':::::get  /userlist::::::', url);

    // const limit = Number(url.slice(16)[0] + url.slice(16)[1]);
    // const page = Number(url.slice(24)[0]);
    // const start = limit * page - limit + 1;
    // const end = limit * page;
    const limitArr: RegExpMatchArray | null = url.match(/limit=(\d+(\d)*)/);
    const pageArr: RegExpMatchArray | null = url.match(/page=(\d+(\d)*)/);
    const targetArr: RegExpMatchArray | null = url.match(/orderBy=(\w+(\w)*)/);
    const sortArr: RegExpMatchArray | null = url.match(/orderDir=(\w+(\w)*)/);
    if (targetArr && sortArr && limitArr && pageArr) {
      const limit = Number(limitArr[1]);
      const page = Number(pageArr[1]);
      const start = limit * page - limit + 1;
      const end = limit * page;
      const target = String(targetArr[1]);
      const sort = String(sortArr[1]);

      const allUserList = await User.findAll({
        raw: true,
      });
      const total = String(allUserList.length);
      const sendUserList = await User.findAll({
        raw: true,
        where: {
          id: {
            [Sequelize.Op.between]: [start, end],
          },
        },
        order: [[target, sort]],
      });
      if (allUserList) {
        res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        res.set('X-Total-Count', total);
        return res.status(200).json(sendUserList);
      }
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.post('/userlist', async (req, res) => {
  try {
    const { email, password, nickname, profile } = req.body;
    const createUser = await User.create({
      email,
      password,
      nickname,
      profile,
    });
    res.status(200).send('성공');
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.get('/userlist/:id', async (req, res) => {
  try {
    const { email, password, nickname, profile } = req.body;
    const { id } = req.params;
    console.log(id);
    const data = await User.findOne({ where: { id } });

    // const createUser = await User.create({
    //   email,
    //   password,
    //   nickname,
    //   profile,
    // });
    res.status(200).json(data);
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.put('/userlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id', id);
    const { email, password, nickname, profile } = req.body;
    await User.update(
      {
        email,
        password,
        nickname,
        profile,
      },
      { where: { id } }
    );
    res.status(200).send('성공');
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.delete('/userlist/:id', async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  await User.destroy({ where: { id } });
  res.status(200).send('');
});

//-----------------------------------------------------Report
router.get('/report', async (req, res) => {
  try {
    const { url } = req;
    console.log(':::::get /report::::::', url);
    const limitArr: RegExpMatchArray | null = url.match(/limit=(\d+(\d)*)/);
    const pageArr: RegExpMatchArray | null = url.match(/page=(\d+(\d)*)/);
    const targetArr: RegExpMatchArray | null = url.match(/orderBy=(\w+(\w)*)/);
    const sortArr: RegExpMatchArray | null = url.match(/orderDir=(\w+(\w)*)/);
    if (targetArr && sortArr && limitArr && pageArr) {
      const limit = Number(limitArr[1]);
      const page = Number(pageArr[1]);
      const start = limit * page - limit + 1;
      const end = limit * page;
      const target = String(targetArr[1]);
      const sort = String(sortArr[1]);

      const allReportList = await Report.findAll({
        raw: true,
      });
      const total = String(allReportList.length);
      const sendReportList = await Report.findAll({
        raw: true,
        where: {
          id: {
            [Sequelize.Op.between]: [start, end],
          },
        },
        order: [[target, sort]],
      });
      if (allReportList) {
        res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        res.set('X-Total-Count', total);
        return res.status(200).json(sendReportList);
      }
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
