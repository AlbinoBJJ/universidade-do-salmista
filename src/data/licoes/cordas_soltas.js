export default {
  id: 'cordas_soltas',
  title: 'Lição 1: As Cordas Soltas',
  resumo: 'Conhecendo as cordas soltas na pauta.',
  temPartitura: true,
  citacao: '"Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens." (Colossenses 3:23)',
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/exercício_1_cordas_soltas_.musicxml`,
  abas: [
    { id: 'partitura', label: 'Partitura & Tocar', tipo: 'partitura' },
    { 
      id: 'explicacao', 
      label: 'Explicação Teórica', 
      tipo: 'conteudo',
      titulo: 'Entendendo e Praticando as Cordas Soltas', 
      texto: 'Nesta lição, vamos estudar as notas referentes às cordas soltas do violão escritas na pauta musical. Lembre-se de tocar cada nota com calma, prestando atenção na correspondência entre a corda no instrumento e sua posição exata nas linhas e espaços do pentagrama.',
      subtopico: 'Dicas de Execução e Técnica',
      textoSub: 'Para aproveitar ao máximo este exercício, siga as orientações abaixo:',
      itens: [
        '<strong>Sincronia com o Metrônomo:</strong> Ao apertar o play, cada nota soa por 4 batidas. Tente manter o mesmo tempo e constância!',
        '<strong>Movimento de Descida:</strong> Comece pela corda mais grave (6ª corda) e vá "descendo" em direção à corda mais fina, deslizando o seu polegar.',
        '<strong>Movimento de Subida:</strong> Para retornar, "suba" em direção à corda mais grave deslizando com o seu dedo indicador.',
        '<strong>Técnica com Apoio:</strong> Utilize a batida "com apoio" (apoiando o dedo na corda imediatamente seguinte após o toque).',
        '<strong>Exceções do Apoio:</strong> Lembre-se de que, ao tocar a última corda com o polegar (sentido agudo) ou finalizar com o indicador (sentido grave), não haverá corda seguinte para o encosto — o que é perfeitamente normal!'
      ]
    },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      tipo: 'conteudo',
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo as cifras e partituras desta lição para estudar offline ou levar para o ensaio:',
      downloads: [
        { nome: 'Partitura (MusicXML / MuseScore)', url: `${import.meta.env.BASE_URL}assets/musicxml/exercício_1_cordas_soltas.musicxml`, icone: 'bi-file-earmark-music' },      ]
    }
  ],
};