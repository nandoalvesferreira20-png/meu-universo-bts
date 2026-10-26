export interface HistorySource {
  label: string;
  url: string;
}
export interface HistoryEntry {
  year: number;
  era: string;
  title: string;
  summary: string;
  story: string;
  events: string[];
  album: string;
  song: string;
  sources: HistorySource[];
}
export interface ServiceRecord {
  name: string;
  start: string;
  end: string;
  kind: "military" | "alternative";
  image?: {
    src: `/images/${string}`;
    alt: string;
    width: number;
    height: number;
  };
  sources: HistorySource[];
}
const pauseSources: HistorySource[] = [
  {
    label: "FESTA de 2022 · Yonhap",
    url: "https://en.yna.co.kr/view/AEN20220615001052315",
  },
  {
    label: "Esclarecimento da agência · Korea JoongAng Daily",
    url: "https://www.koreajoongangdaily.com/entertainment/bts-video-not-about-hiatus-says-boy-bands-agency-bighit-music/11116927",
  },
];
const lastEnlistments = {
  label: "Alistamentos de dezembro · Yonhap",
  url: "https://en.yna.co.kr/view/AEN20231211008651315",
};
const lastReturns = {
  label: "Conclusão do serviço dos sete · AP",
  url: "https://apnews.com/article/2d9c423b51768657a59cd52db09ff5ff",
};
export const serviceRecords: ServiceRecord[] = [
  {
    name: "Jin",
    start: "2022-12-13",
    end: "2024-06-12",
    kind: "military",
    sources: [
      {
        label: "Início do serviço de Jin · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20221213001053315",
      },
      {
        label: "Retorno de Jin · Korea Herald",
        url: "https://www.koreaherald.com/article/3411474",
      },
    ],
  },
  {
    name: "j-hope",
    start: "2023-04-18",
    end: "2024-10-17",
    kind: "military",
    sources: [
      {
        label: "Início do serviço de j-hope · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20230417006252315",
      },
      {
        label: "Retorno de j-hope · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20241017001051315",
      },
    ],
  },
  {
    name: "SUGA",
    start: "2023-09-22",
    end: "2025-06-21",
    kind: "alternative",
    sources: [
      {
        label: "Início do serviço alternativo · AP",
        url: "https://apnews.com/article/8a0318e3008747139bb8d8903dee348d",
      },
      lastReturns,
    ],
  },
  {
    name: "RM",
    start: "2023-12-11",
    end: "2025-06-10",
    kind: "military",
    sources: [
      lastEnlistments,
      {
        label: "Retorno de RM e V · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20250610000700315",
      },
    ],
  },
  {
    name: "V",
    start: "2023-12-11",
    end: "2025-06-10",
    kind: "military",
    sources: [
      lastEnlistments,
      {
        label: "Retorno de RM e V · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20250610000700315",
      },
    ],
  },
  {
    name: "Jimin",
    start: "2023-12-12",
    end: "2025-06-11",
    kind: "military",
    sources: [
      lastEnlistments,
      {
        label: "Retorno de Jimin e Jung Kook · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20250611000951315",
      },
    ],
  },
  {
    name: "Jung Kook",
    start: "2023-12-12",
    end: "2025-06-11",
    kind: "military",
    sources: [
      lastEnlistments,
      {
        label: "Retorno de Jimin e Jung Kook · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20250611000951315",
      },
    ],
  },
];
export const reunionChapter = {
  title: "A pausa que não foi um adeus",
  subtitle:
    "Entre despedidas temporárias, novos caminhos e reencontros, os sete continuaram escrevendo sua história.",
  decision:
    "Depois de Proof, a conversa do FESTA em 14 de junho de 2022 apresentou uma mudança de ritmo: uma pausa nas atividades regulares em grupo para dar prioridade ao desenvolvimento individual. A agência esclareceu que as atividades solo e coletivas continuariam coexistindo. O BTS não estava se dissolvendo. Em 17 de outubro, um comunicado posterior confirmou os planos de cumprimento do serviço militar — um anúncio distinto da decisão artística de junho.",
  departures:
    "Jin iniciou o serviço em dezembro de 2022. Em 2023, vieram j-hope, SUGA, RM e V, e depois Jimin e Jung Kook. Os cartões seguem a ordem de início do serviço; cada trajetória tem seu próprio tempo de retorno. SUGA cumpriu serviço social alternativo, enquanto os outros seis serviram no Exército.",
  returns:
    "Jin e j-hope foram os primeiros a retornar, em 2024. Em junho de 2025, vieram RM e V, Jimin e Jung Kook e, por último, a conclusão oficial de SUGA. A ARMY acompanhou esses reencontros junto dos trabalhos individuais. Lançamentos preparados anteriormente mantiveram a música presente durante o período de serviço; a história artística não ficou totalmente em silêncio.",
  together:
    "Com os sete de volta, começou a preparação de uma nova fase coletiva. Na transmissão conjunta de julho de 2025, o grupo anunciou um álbum para o ano seguinte. Concluir o serviço e voltar a criar juntos não significou realizar imediatamente um show de comeback. Esse processo levou a ARIRANG, lançado em 20 de março de 2026. Na leitura afetiva desta jornada, reencontrar também é abrir espaço para tudo o que cada um se tornou.",
  sources: [
    ...pauseSources,
    {
      label: "Contexto do período · Korea Herald",
      url: "https://www.koreaherald.com/article/10649541",
    },
    {
      label: "Anúncio militar de outubro · Yonhap",
      url: "https://en.yna.co.kr/view/AEN20221017007900315",
    },
    {
      label: "Preparação do novo álbum · AP",
      url: "https://apnews.com/article/18fb477594e545307808165bcf7d1d6d",
    },
  ],
};
const discography = {
  label: "Discografia · BIGHIT MUSIC",
  url: "https://bts.ibighit.com/eng/discography/",
};
const chronology = {
  label: "Cronologia · Yonhap",
  url: "https://en.yna.co.kr/view/AEN20221017007900315",
};
const japan = {
  label: "Lançamentos · BTS Japan Official",
  url: "https://bts-official.jp/discography",
};
export const brazilSource = {
  label: "Shows de 2019 · Prefeitura de São Paulo",
  url: "https://prefeitura.sp.gov.br/w/noticia/cet-monitora-transito-na-regiao-do-allianz-parque-para-shows-do-bts",
};
export const history: HistoryEntry[] = [
  {
    year: 2013,
    era: "O primeiro passo",
    title: "O começo de tudo",
    summary:
      "Sete vozes se apresentam ao mundo. O sonho ainda era um ponto de partida.",
    story:
      "RM, Jin, SUGA, j-hope, Jimin, V e Jung Kook estreiam em 13 de junho de 2013. Com raízes no hip-hop, o BTS coloca em pauta as expectativas impostas à juventude. No More Dream pergunta pelo sonho de cada um: uma abertura para uma conversa que atravessaria os anos.",
    events: [
      "Estreia do grupo em 13 de junho.",
      "2 COOL 4 SKOOL apresenta No More Dream.",
      "O!RUL8,2? dá continuidade à fase escolar.",
    ],
    album: "2 COOL 4 SKOOL",
    song: "No More Dream",
    sources: [
      discography,
      chronology,
      {
        label: "Os sete integrantes · perfil oficial",
        url: "https://bts.ibighit.com/eng/profile/",
      },
    ],
  },
  {
    year: 2014,
    era: "School trilogy",
    title: "Construindo sua identidade",
    summary:
      "A intensidade do início encontra novas formas de falar sobre afeto e desejo.",
    story:
      "Skool Luv Affair amplia o universo escolar; DARK & WILD, primeiro álbum de estúdio, explora relações com uma sonoridade mais intensa. A estreia japonesa e apresentações fora da Coreia aproximam o grupo de novos públicos. O encontro com o mundo começa a ganhar espaço na trajetória.",
    events: [
      "Lançamento de Skool Luv Affair e DARK & WILD.",
      "Estreia no mercado japonês com No More Dream.",
      "Apresentações internacionais, incluindo a KCON em Los Angeles.",
    ],
    album: "DARK & WILD",
    song: "Danger",
    sources: [
      discography,
      chronology,
      japan,
      {
        label: "KCON 2014 · organização do evento",
        url: "https://kconusa.com/historybk/kcon14/",
      },
    ],
  },
  {
    year: 2015,
    era: "HYYH",
    title: "The Most Beautiful Moment in Life",
    summary:
      "A juventude aparece por inteiro: bonita, incerta e em transformação.",
    story:
      "As duas partes de The Most Beautiful Moment in Life, conhecidas como HYYH, aproximam fragilidade e esperança. I NEED U e RUN acompanham personagens entre amizade, insegurança e amadurecimento. Nesta leitura editorial, crescer deixa de parecer uma linha reta: é tentar de novo, juntos.",
    events: [
      "The Most Beautiful Moment in Life Pt. 1 e Pt. 2.",
      "I NEED U e RUN marcam a nova fase narrativa.",
    ],
    album: "HYYH Pt. 1 / Pt. 2",
    song: "I NEED U · RUN",
    sources: [discography, chronology],
  },
  {
    year: 2016,
    era: "WINGS",
    title: "Aprender a abrir as asas",
    summary:
      "Entre a despedida da juventude e novos horizontes, cada voz ganha espaço.",
    story:
      "Young Forever reúne a fase HYYH antes da chegada de WINGS. Com faixas solo dos sete integrantes, o álbum amplia as perspectivas do grupo. Blood Sweat & Tears apresenta um universo de tentação e escolhas, levando a narrativa visual e musical a outro patamar.",
    events: [
      "Lançamento de Young Forever e WINGS.",
      "Sete faixas solo revelam diferentes sensibilidades.",
      "WINGS amplia a presença do grupo nas paradas internacionais.",
    ],
    album: "WINGS",
    song: "Blood Sweat & Tears",
    sources: [discography, chronology],
  },
  {
    year: 2017,
    era: "You never walk alone",
    title: "Um novo alcance mundial",
    summary:
      "A promessa de companhia encontra ouvintes cada vez mais distantes.",
    story:
      "You Never Walk Alone traz Spring Day, uma canção que abre espaço para saudade e reencontro. LOVE YOURSELF: HER inicia outra etapa com DNA. O reconhecimento no Billboard Music Awards aproxima o BTS de um público internacional ainda maior, enquanto a relação com a ARMY segue no centro dessa caminhada.",
    events: [
      "You Never Walk Alone e Spring Day.",
      "LOVE YOURSELF: HER e DNA.",
      "Prêmio Top Social Artist no Billboard Music Awards.",
    ],
    album: "LOVE YOURSELF: HER",
    song: "Spring Day · DNA",
    sources: [discography, chronology],
  },
  {
    year: 2018,
    era: "LOVE YOURSELF",
    title: "Uma voz para ser quem se é",
    summary: "Amar a si mesmo se torna uma conversa que atravessa fronteiras.",
    story:
      "TEAR e ANSWER desenvolvem diferentes lados da ideia de amor-próprio. FAKE LOVE e IDOL dão forma a essa busca. Em 24 de setembro, RM discursa na sede das Nações Unidas no lançamento de Generation Unlimited, ao lado dos integrantes, convidando jovens a reconhecer a própria voz.",
    events: [
      "LOVE YOURSELF: TEAR e ANSWER chegam ao primeiro lugar do Billboard 200.",
      "FAKE LOVE e IDOL acompanham a era.",
      "Discurso de RM nas Nações Unidas, em evento da UNICEF.",
    ],
    album: "LOVE YOURSELF: ANSWER",
    song: "FAKE LOVE · IDOL",
    sources: [
      discography,
      chronology,
      {
        label: "Discurso de RM · UNICEF",
        url: "https://www.unicef.org/press-releases/we-have-learned-love-ourselves-so-now-i-urge-you-speak-yourself",
      },
    ],
  },
  {
    year: 2019,
    era: "PERSONA",
    title: "Um mundo que canta junto",
    summary:
      "Dos detalhes cotidianos aos estádios, a conexão ganha outra dimensão.",
    story:
      "MAP OF THE SOUL: PERSONA traz Boy With Luv, com Halsey. A turnê LOVE YOURSELF: SPEAK YOURSELF leva o repertório a estádios e passa por São Paulo. Para a comunidade brasileira, esses encontros ocupam um lugar especial na memória compartilhada de acompanhar o grupo de perto.",
    events: [
      "Lançamento de MAP OF THE SOUL: PERSONA.",
      "Boy With Luv, com Halsey.",
      "Shows em 25 e 26 de maio no Allianz Parque, em São Paulo.",
    ],
    album: "MAP OF THE SOUL: PERSONA",
    song: "Boy With Luv",
    sources: [discography, chronology, brazilSource],
  },
  {
    year: 2020,
    era: "MAP OF THE SOUL: 7 / BE",
    title: "Perto, mesmo à distância",
    summary:
      "Um ano de distância física encontra na música uma forma de presença.",
    story:
      "MAP OF THE SOUL: 7 revisita a trajetória dos sete, com Black Swan e ON. Durante a pandemia, Dynamite oferece uma energia luminosa; BE traz um registro mais íntimo do período. Life Goes On transforma a pausa em uma conversa sobre continuar, mesmo sem todas as respostas.",
    events: [
      "MAP OF THE SOUL: 7, ON e Black Swan.",
      "Dynamite alcança o primeiro lugar do Hot 100.",
      "BE é lançado com Life Goes On, também número um no Hot 100.",
    ],
    album: "MAP OF THE SOUL: 7 · BE",
    song: "Black Swan · Life Goes On",
    sources: [discography, chronology],
  },
  {
    year: 2021,
    era: "Permission to dance",
    title: "Novas conquistas",
    summary: "O desejo de reencontro ganha ritmo, cor e espaço no palco.",
    story:
      "Butter e Permission to Dance acompanham um ano de novas conquistas. My Universe, com Coldplay, aproxima duas bandas e diferentes públicos. Com os concertos Permission to Dance on Stage em Los Angeles, o encontro presencial com fãs volta a fazer parte da história.",
    events: [
      "Butter, Permission to Dance e My Universe chegam ao topo do Hot 100.",
      "BTS recebe Artist of the Year no American Music Awards.",
      "Concertos presenciais em Los Angeles.",
    ],
    album: "Butter / Permission to Dance (single)",
    song: "Butter · My Universe",
    sources: [discography, chronology],
  },
  {
    year: 2022,
    era: "Proof",
    title: "Um novo capítulo",
    summary:
      "Olhar para o caminho percorrido também abre espaço para descobrir outras vozes.",
    story:
      "A antologia Proof reúne memórias e apresenta Yet To Come. No FESTA de junho, os sete apresentam uma mudança de foco para projetos individuais, com continuidade do grupo. O concerto em Busan acontece em outubro. Ainda naquele mês, um comunicado distinto confirma os planos de cumprimento do serviço militar.",
    events: [
      "Proof e Yet To Come.",
      "Concerto Yet To Come em Busan.",
      "FESTA de junho: prioridade aos projetos individuais, sem dissolução do BTS.",
      "Outubro: confirmação dos planos de serviço militar; Jin inicia o serviço em dezembro.",
    ],
    album: "Proof",
    song: "Yet To Come",
    sources: [discography, chronology, ...pauseSources],
  },
  {
    year: 2023,
    era: "Sete caminhos",
    title: "Caminhos individuais",
    summary:
      "Diferentes linguagens revelam novos detalhes de artistas que seguimos conhecendo.",
    story:
      "FACE, de Jimin; D-DAY, de Agust D (SUGA); Layover, de V; e GOLDEN, de Jung Kook mostram caminhos próprios. Take Two, lançamento do BTS no aniversário de dez anos, mantém uma ponte com a ARMY. Ao longo do ano, os integrantes que ainda não serviam iniciam suas obrigações militares.",
    events: [
      "FACE, D-DAY, Layover e GOLDEN ampliam os repertórios solo.",
      "Take Two celebra os dez anos do grupo.",
      "Até dezembro, os sete integrantes estão cumprindo o serviço.",
    ],
    album: "FACE · D-DAY · Layover · GOLDEN",
    song: "Take Two",
    sources: [
      discography,
      {
        label: "Take Two · anúncio BIGHIT MUSIC",
        url: "https://weverse.io/bts/notice/13775",
      },
      japan,
      {
        label: "Serviço e retorno · AP",
        url: "https://apnews.com/article/2d9c423b51768657a59cd52db09ff5ff",
      },
    ],
  },
  {
    year: 2024,
    era: "Presença e espera",
    title: "A jornada continua",
    summary:
      "A espera também é feita de música, descobertas e primeiros retornos.",
    story:
      "Projetos preparados pelos integrantes continuam chegando ao público: HOPE ON THE STREET VOL.1, Right Place, Wrong Person, MUSE e Happy. Jin conclui o serviço em 12 de junho; j-hope, em 17 de outubro. Os retornos trazem novos encontros enquanto a comunidade acompanha os demais integrantes.",
    events: [
      "Jin retorna em 12 de junho; j-hope, em 17 de outubro.",
      "Novos trabalhos de j-hope, RM, Jimin e Jin.",
    ],
    album: "Right Place, Wrong Person · MUSE · Happy",
    song: "Who · Running Wild",
    sources: [
      japan,
      {
        label: "Retorno de Jin · Korea Herald",
        url: "https://www.koreaherald.com/article/3411474",
      },
      {
        label: "Retorno de j-hope · Yonhap",
        url: "https://en.yna.co.kr/view/AEN20241017001051315",
      },
    ],
  },
  {
    year: 2025,
    era: "Juntos outra vez",
    title: "O reencontro",
    summary:
      "Os caminhos voltam a se aproximar. Um novo trabalho coletivo começa a tomar forma.",
    story:
      "RM e V concluem o serviço em 10 de junho; Jimin e Jung Kook, em 11 de junho. A data oficial de conclusão de SUGA é 21 de junho. Em julho, os sete aparecem juntos em uma transmissão e anunciam a preparação de um álbum para 2026: o reencontro passa a ser também um processo criativo.",
    events: [
      "Conclusão das obrigações militares dos sete integrantes.",
      "Transmissão conjunta em julho anuncia o próximo álbum.",
      "Atividades individuais seguem, incluindo Echo, de Jin.",
    ],
    album: "Echo (Jin) · preparação do álbum coletivo",
    song: "Don't Say You Love Me (Jin)",
    sources: [
      japan,
      {
        label: "Conclusão do serviço · AP",
        url: "https://apnews.com/article/2d9c423b51768657a59cd52db09ff5ff",
      },
      {
        label: "Anúncio do reencontro · AP",
        url: "https://apnews.com/article/18fb477594e545307808165bcf7d1d6d",
      },
    ],
  },
  {
    year: 2026,
    era: "ARIRANG",
    title: "Sete vozes, um novo horizonte",
    summary:
      "Voltar às raízes para seguir em frente. A história coletiva ganha um novo capítulo.",
    story:
      "Lançado em 20 de março de 2026, ARIRANG marca a volta do BTS a um álbum coletivo. O título remete à canção tradicional coreana e aproxima raízes, distância e resiliência. Com SWIM, a era apresenta o grupo em seu momento atual. Nesta leitura editorial, o reencontro com a ARMY também é uma oportunidade de crescer juntos outra vez.",
    events: [
      "ARIRANG é lançado em 20 de março de 2026.",
      "O álbum reúne 14 faixas, com SWIM como single principal.",
      "A identidade coreana e as experiências dos sete orientam o novo trabalho.",
    ],
    album: "ARIRANG",
    song: "SWIM",
    sources: [
      japan,
      {
        label: "ARIRANG · Universal Music",
        url: "https://www.universalmusic.ca/2026/03/23/bts-fifth-studio-album-arirang-out-now/",
      },
    ],
  },
];
export const historySources = Array.from(
  new Map(
    [
      ...history.flatMap((entry) => entry.sources),
      ...reunionChapter.sources,
      ...serviceRecords.flatMap((record) => record.sources),
    ].map((source) => [source.url, source]),
  ).values(),
);
