export default {
  id: 'cordas_soltas',
  title: 'Lição 1: As Cordas Soltas',
  resumo: 'Conhecendo as cordas soltas na pauta e a figura da semibreve.',
  temPartitura: true,
  citacao: '"Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens." (Colossenses 3:23)',
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/exercício_1_cordas_soltas.musicxml`,
  abas: [
    { 
      id: 'partitura', 
      label: 'Partitura & Tocar', 
      tipo: 'partitura' 
    },
    { 
      id: 'teoria', 
      label: 'Teoria Musical', 
      tipo: 'conteudo',
      titulo: 'Entendendo a Semibreve e o Compasso 4/4', 
      texto: 'Nesta lição introdutória, vamos compreender dois elementos fundamentais da linguagem musical presentes no exercício: a fórmula de compasso e a figura de valor chamada semibreve.',
      subtopico: 'A Figura da Semibreve',
      textoSub: 'A semibreve é a figura de maior duração usada atualmente na música:',
      itens: [
        '<strong>Valor de Duração:</strong> Em um compasso 4/4, a semibreve preenche o compasso inteiro sozinha, valendo exatamente 4 tempos (ou batidas).',
        '<strong>Representação na Pauta:</strong> Visualmente, ela se parece com uma cabeça de nota oval e vazia por dentro, sem haste.',
        '<strong>Silêncio correspondente:</strong> Quando precisamos silenciar por um compasso inteiro em 4/4, utilizamos a pausa de semibreve, que se parece com um pequeno retângulo "pendurado" na quarta linha da pauta.'
      ],
      subtopico2: 'A Fórmula de Compasso (4/4)',
      textoSub2: 'No início da partitura, encontramos a indicação 4/4:',
      itens2: [
        '<strong>O número superior (4):</strong> Indica que cada compasso possui a quantidade exata de 4 tempos.',
        '<strong>O número inferior (4):</strong> Indica que a semibreve serve de referência para a unidade de tempo.'
      ]
    },
    { 
      id: 'tecnica', 
      label: 'Técnica e Execução', 
      tipo: 'conteudo',
      titulo: 'Dicas de Postura e Mão Direita', 
      texto: 'Para aproveitar ao máximo este exercício de cordas soltas, siga orientações fundamentais de ergonomia e toque:',
      subtopico: 'Orientações Práticas',
      textoSub: 'Atenção aos movimentos e constância do som:',
      itens: [
        '<strong>Sincronia com o Metrônomo:</strong> Ao apertar o play, cada nota soa por 4 batidas exatas (uma semibreve por compasso). Mantenha o som limpo e constante até o final de cada tempo!',
        '<strong>Movimento de Descida:</strong> Comece pela corda mais grave (6ª corda - Mi) e vá "descendo" em direção à corda mais fina, deslizando o polegar.',
        '<strong>Movimento de Subida:</strong> Para retornar, "suba" em direção à corda mais grave deslizando com o seu dedo indicador.',
        '<strong>Técnica com Apoio:</strong> Utilize a batida "com apoio" (apoiando o dedo na corda imediatamente seguinte após o toque para gerar mais projeção sonora).',
        '<strong>Exceções do Apoio:</strong> Lembre-se de que, ao tocar a última corda com o polegar (sentido agudo) ou finalizar com o indicador (sentido grave), não haverá corda seguinte para o encosto — o que é perfeitamente normal!'
      ]
    },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      tipo: 'conteudo',
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo as partituras desta lição para estudar offline ou levar para o ensaio:',
      downloads: [
        { nome: 'Partitura (MusicXML / MuseScore)', url: `${import.meta.env.BASE_URL}assets/musicxml/exercício_1_cordas_soltas.musicxml`, icone: 'bi-file-earmark-music' },      
      ]
    }
  ],
};