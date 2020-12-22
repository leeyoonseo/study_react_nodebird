const express = require('express');
const router = express.Router();

// 주소가 겹치면 use에서 인수를 먼저 넘긴다.
// prefix가 될 수 있도록
router.post('/', (req, res) => { // POST /post
    res.json({ id: 1, content: 'hello'});
});

router.delete('/', (req, res) => { // DELETE /post
    res.json({ id: 1 });
});

module.exports = router;