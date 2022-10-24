const ALL_STEM = {
    scribe: {
        id: 1,
        spells: [
            {
                id: 1,
                spell: "scribe"
            },
            {
                id: 2,
                spell: "scrip[t]",
                explain: "通常表示名词时使用，一般用于后接 ion/ure 的情况"
            }
        ],
        word: {// as a word
            meanings: [
                {
                    id: 1,
                    meaning: "书记、抄写者、作家",
                    type: "noun",
                }
            ]
        },
        means: [
            {
                id: 1,
                mean: "写，write",
                examples: [
                    {
                        id: 1,
                        word: "conscribe",
                        explain: "一起写下姓名 -> 征兵，类似于与子同袍的意思"
                    }
                ]
            }
        ]
    }
}

export default ALL_STEM