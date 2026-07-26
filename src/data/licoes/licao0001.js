export default {
  id: 'licao0001',
  title: 'Lição 1: Pelos Prados',
  resumo: 'Partitura da música Pelos Prados e Campinas adaptada em C maior para o Salmo 22(23).',
  temPartitura: true,
  arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/pelos_prados.musicxml`,
  abas: [
    { id: 'partitura', label: 'Partitura & Tocar', tipo: 'partitura' },
    { 
      id: 'apoio', 
      label: 'Material de Apoio', 
      titulo: 'Materiais para Download', 
      texto: 'Baixe abaixo as cifras e partituras desta lição para estudar offline ou levar para o ensaio:',
      downloads: [
        { nome: 'Partitura (MusicXML / MuseScore)', url: `${import.meta.env.BASE_URL}assets/musicxml/pelos_prados.musicxml`, icone: 'bi-file-earmark-music' },
        { nome: 'Cifra e Letra Completa (PDF/Texto)', url: `${import.meta.env.BASE_URL}assets/pdf/pelos_prados.pdf`, icone: 'bi-file-earmark-pdf' }
      ]
    }
  ],
  letraCompleta: [
    {
      estrofe: "1",
      linhas: [
        "Pelos prados e campinas verdes, verdes, eu vou.",
        "É o Senhor que me leva a descansar.",
        "Junto às fontes de águas puras, repousantes eu vou!",
        "Minhas forças, o Senhor vai animar."
      ]
    },
    {
      estrofe: "Refrão",
      linhas: [
        "Tu és, Senhor, o meu Pastor. Por isso nada em minha vida faltará!",
        "Tu és, Senhor, o meu Pastor. Nada faltará!"
      ]
    },
    {
      estrofe: "2",
      linhas: [
        "Nos caminhos mais seguros junto d'Ele eu vou,",
        "e para sempre o Seu nome eu honrarei.",
        "Se eu encontro mil abismos nos caminhos eu vou,",
        "segurança sempre tenho em Suas mãos."
      ]
    },
    {
      estrofe: "3",
      linhas: [
        "Ao banquete em Sua casa muito alegre eu vou,",
        "um lugar na Sua mesa me preparou.",
        "Ele unge minha fronte e me faz ser feliz,",
        "e transborda a minha taça em Seu amor."
      ]
    },
    {
      estrofe: "4",
      linhas: [
        "Com alegria e esperança caminhando eu vou,",
        "minha vida está sempre em Suas mãos.",
        "E na casa do Senhor eu irei habitar,",
        "e este canto para sempre irei cantar."
      ]
    }
  ]
};