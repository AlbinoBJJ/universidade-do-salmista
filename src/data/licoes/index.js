import introducao from './introducao';
import pelos_prados from './pelos_prados';
import confesso_a_deus from './confesso_a_deus';
import cordas_soltas from './cordas_soltas';
import salmo_24 from './salmo_24';
import salmo_68 from './salmo_68';

export const listaLicoes = [
  {
    categoria: "Módulos de Estudo",
    itens: [
      introducao, // Fica solto pois não tem submenu
      {
        subgrupo: "Teoria",
        idGrupo: "modulo_teoria",
        itens: [
          cordas_soltas,
          { 
            id: 'licao0004', 
            title: 'Lição 2: Em breve', 
            resumo: 'Conteúdo em desenvolvimento.',
            temPartitura: false 
          }
        ]
      },
      {
        subgrupo: "Harmonia",
        idGrupo: "modulo_harmonia",
        itens: [
          { 
            id: 'harmonia_01', 
            title: 'Introdução à Harmonia (Em breve)', 
            resumo: 'Conteúdo em desenvolvimento.',
            temPartitura: false 
          }
        ]
      }
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
        itens: [confesso_a_deus]
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