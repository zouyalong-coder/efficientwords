const ALL_PREFIX = {
    super: {
        id: 1,
        spells: [
            {
                id: 1,
                spell: "super",
                isStem: true
            },
            {
                id: 2,
                spell: "supra"
            }
        ],
        origin: "来自于拉丁语",
        meanings: [
            {
                id: 1,
                meaning: "在...之上",
                examples: [
                    {
                        id: 1,
                        word: "superficial",
                        explain: "super(在...上) + ficial(面部的) => 在面部之上的 => 肤浅的"
                    },
                ]
            },
            {
                meaning: "超过、超级",
                examples: [
                    {
                        id: 2,
                        word: "superman",
                        explain: "超过一般人 => 超人"
                    },
                ]
            },
            {
                meaning: "过度",
                examples: [
                    {
                        id: 1,
                        word: "supersubtle",
                        explain: "过度微妙的"
                    },
                ]
            },
        ]
    },
    uni: {
        id: 2,
        spells: [
            {
                id: 3,
                spell: "uni",
                isStem: true
            },
        ],
        origin: "来自于one，o=>u、e=>i",
        meanings: [
            {
                id: 1,
                meaning: "一、统一",
                examples: [
                    {
                        id: 1,
                        word: "unique",
                        explain: "唯一的"
                    },
                    {
                        id: 2,
                        word: "unit",
                        explain: "统一；一个，不可再分 => 单元"
                    }
                ]
            },
        ]
    },
    "a--": {
        id: 3,
        spells: [
            {
                id: 1,
                spell: "aff",
            }
        ],
        meanings: [
            {
                id: 1,
                meaning: "a + 重复辅音字母，无额外含义，表加强语气",
                examples: [
                    {
                        id: 1,
                        word: "affirm",
                        explain: "firm 确认"
                    }
                ]
            }
        ]
    }
}

export const LIST_PREFIX = {
    error: "ok",
    data: [

    ]
}