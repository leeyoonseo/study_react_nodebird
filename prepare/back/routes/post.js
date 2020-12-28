const express = require('express');
const router = express.Router();

// 주소가 겹치면 use에서 인수를 먼저 넘긴다.
// prefix가 될 수 있도록
router.post('/', (req, res) => {
    res.json([
        { id:1, content: 'h1' },
        { id:2, content: 'h2' },
        { id:3, content: 'h3' },
    ]);
});

router.delete('/', (req, res) => {
    res.json({ id:1, content: 'hello' });

});

module.exports = router;