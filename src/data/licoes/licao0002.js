export default {
  id: 'licao0002',
  title: 'Lição 2: Confesso a Deus',
  resumo: 'Estudo do Ato Penitencial "Confesso a Deus", adaptado para acompanhamento e leitura rítmica.',
  temPartitura: true,
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/confesso_a_deus.musicxml`,
  abas: [
    { id: 'partitura', label: 'Partitura & Tocar', tipo: 'partitura' },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo os arquivos de suporte para esta lição:',
      downloads: [
        { nome: 'Partitura - Confesso a Deus (MusicXML)', url: `${import.meta.env.BASE_URL}assets/musicxml/confesso_a_deus.musicxml`, icone: 'bi-file-earmark-music' },
        { nome: 'Cifra e Letra Completa (PDF/Texto)', url: `${import.meta.env.BASE_URL}assets/pdf/confesso_a_deus.pdf`, icone: 'bi-file-earmark-pdf' }
      ]
    }
  ],
  letraCompleta: [
    {
      estrofe: "1",
      linhas: [
        "Confesso a Deus todo-poderoso",
        "e a vós, irmãos e irmãs,",
        "que pequei muitas vezes",
        "por pensamentos e palavras,",
        "atos e omissões,"
      ]
    },
    {
      estrofe: "Refrão / Súplica",
      linhas: [
        "por minha culpa, por minha culpa, por minha tão grande culpa.",
        "E por isso peço à Virgem Maria,",
        "a todos os anjos e santos,",
        "e a vós, irmãos e irmãs,",
        "que oreis por mim ao Senhor, nosso Deus."
      ]
    }
  ]
};