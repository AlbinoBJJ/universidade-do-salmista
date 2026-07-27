export default {
  id: 'salmo_68',
  title: 'Salmo 68',
  resumo: 'Salmo responsorial do 12º Domingo Comum — Atendei-me, ó Senhor, pelo vosso imenso amor!',
  temPartitura: true,
  citacao: '"Atendei-me, ó Senhor, pelo vosso imenso amor!" — (Sl 68, 14)',
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/salmo_68.musicxml`,
  abas: [
    { id: 'partitura', label: 'Partitura & Tocar', tipo: 'partitura' },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo as cifras e partituras desta lição para estudar offline ou levar para o ensaio:',
      downloads: [
        { nome: 'Partitura (MusicXML / MuseScore)', url: `${import.meta.env.BASE_URL}assets/musicxml/salmo_68.musicxml`, icone: 'bi-file-earmark-music' },
        { nome: 'Cifra e Letra Completa (PDF/Texto)', url: `${import.meta.env.BASE_URL}assets/pdf/salmo_68.pdf`, icone: 'bi-file-earmark-pdf' }
      ]
    }
  ],
  letraCompleta: [
    {
      estrofe: "Refrão",
      linhas: [
        "Atendei-me, ó Senhor, pelo vosso imenso amor!"
      ]
    },
    {
      estrofe: "1",
      linhas: [
        "Por vossa causa é que sofri tantos insultos,",
        "e o meu rosto se cobriu de confusão;",
        "eu me tornei como um estranho a meus irmãos,",
        "como estrangeiro para os filhos de minha mãe.",
        "Pois meu zelo e meu amor por vossa casa",
        "me devoram como fogo abrasador."
      ]
    },
    {
      estrofe: "2",
      linhas: [
        "Por isso elevo para vós minha oração,",
        "neste tempo favorável, Senhor Deus!",
        "Respondei-me pelo vosso imenso amor,",
        "pela vossa salvação que nunca falha!",
        "Senhor, ouvi-me, pois suave é vossa graça,",
        "ponde os olhos sobre mim com grande amor!"
      ]
    },
    {
      estrofe: "3",
      linhas: [
        "Humildes, vede isto e alegrai-vos:",
        "o vosso coração reviverá,",
        "se procurardes o Senhor continuamente!",
        "Pois nosso Deus atende à prece dos seus pobres,",
        "e não despreza o clamor de seus cativos.",
        "Que céus e terra glorifiquem o Senhor",
        "com o mar e todo ser que neles vive!"
      ]
    }
  ]
};