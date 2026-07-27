import licao0000 from './licao0000';
import pelos_prados from './pelos_prados';
import licao0002 from './licao0002';
import licao0003 from './licao0003';
import salmo_24 from './salmo_24';
import salmo_68 from './salmo_68';

export const listaLicoes = [
  {
    categoria: "Módulos de Estudo",
    itens: [
      licao0000,
      licao0003,
      { 
        id: 'licao0004', 
        title: 'Lição 4: Em breve', 
        resumo: 'Conteúdo em desenvolvimento.',
        temPartitura: false 
      },
    ]
  },
  {
    categoria: "Repertório & Liturgia",
    itens: [
      {
        subgrupo: "Entrada",
        idGrupo: "entrada",
        itens: [
          { id: 'entrada_01', title: 'Canto de Entrada (Em breve)', resumo: 'Aguardando cadastro de cifra.', temPartitura: false }
        ]
      },
      {
        subgrupo: "Ato Penitencial",
        idGrupo: "ato_penitencial",
        itens: [licao0002] // Confesso a Deus
      },
      {
        subgrupo: "Glória",
        idGrupo: "gloria",
        itens: [
          { id: 'gloria_01', title: 'Glória (Em breve)', resumo: 'Aguardando cadastro de cifra.', temPartitura: false }
        ]
      },
      {
        subgrupo: "Salmos",
        idGrupo: "salmos",
        itens: [
          salmo_24,
          salmo_68
        ]
      },
      {
        subgrupo: "Aclamação",
        idGrupo: "aclamacao",
        itens: [
          { id: 'aclamacao_01', title: 'Aleluia (Em breve)', resumo: 'Aguardando cadastro de cifra.', temPartitura: false }
        ]
      },
      {
        subgrupo: "Ofertório",
        idGrupo: "ofertorio",
        itens: [
          { id: 'ofertorio_01', title: 'Canto de Ofertório (Em breve)', resumo: 'Aguardando cadastro de cifra.', temPartitura: false }
        ]
      },
      {
        subgrupo: "Comunhão",
        idGrupo: "comunhao",
        itens: [pelos_prados]
      }
    ]
  }
];