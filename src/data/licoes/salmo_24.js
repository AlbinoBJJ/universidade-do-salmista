export default {
  id: 'salmo_24',
  title: 'Salmo 24',
  resumo: 'Salmo responsorial do 4º Domingo do Advento — O Emanuel: Deus conosco.',
  temPartitura: true,
  citacao: '"O Rei da glória é o Senhor onipotente; abri as portas para que ele possa entrar!" — (Sl 24, 7-10)',
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/salmo_24.musicxml`,
  abas: [
    { id: 'partitura', label: 'Partitura & Tocar', tipo: 'partitura' },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo as cifras e partituras desta lição para estudar offline ou levar para o ensaio:',
      downloads: [
        { nome: 'Partitura (MusicXML / MuseScore)', url: `${import.meta.env.BASE_URL}assets/musicxml/salmo_24.musicxml`, icone: 'bi-file-earmark-music' },
        { nome: 'Cifra e Letra Completa (PDF/Texto)', url: `${import.meta.env.BASE_URL}assets/pdf/salmo_24.pdf`, icone: 'bi-file-earmark-pdf' }
      ]
    }
  ],
  letraCompleta: [
    {
      estrofe: "Refrão",
      linhas: [
        "O Rei da glória é o Senhor onipotente;",
        "abri as portas para que ele possa entrar!"
      ]
    },
    {
      estrofe: "1",
      linhas: [
        "Ao Senhor pertence a terra e o que ela encerra,",
        "o mundo inteiro com os seres que o povoam;",
        "porque ele a tornou firme sobre os mares,",
        "e sobre as águas a mantém inabalável."
      ]
    },
    {
      estrofe: "2",
      linhas: [
        "“Quem subirá até o monte do Senhor,",
        "quem ficará em sua santa habitação?”",
        "“Quem tem mãos puras e inocente coração,",
        "quem não dirige sua mente para o crime”."
      ]
    },
    {
      estrofe: "3",
      linhas: [
        "Sobre este desce a bênção do Senhor",
        "e a recompensa de seu Deus e Salvador.",
        "“É assim a geração dos que o procuram,",
        "e do Deus de Israel buscam a face”."
      ]
    }
  ]
};