import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  formulario: {
    padding: 40,
    paddingVertical: 50,
    backgroundColor: '#262626',
  },
  formularioScrool: {
    padding: 60,
    paddingVertical: 80,
    backgroundColor: '#262626',
  },
  fundo: {
    padding: 60,
    paddingVertical: 80,
    backgroundColor: '#262626',
  },
  text: {
    fontFamily: 'Lemon-Regular',
    fontSize: 20,
    textAlign: 'center',
  },
  textinho: {
    fontFamily: 'Lemon-Regular',
    fontSize: 13,
  },
  textForms: {
    fontFamily: 'Lemon-Regular',
    color: 'white', 
    textAlign:'left', 
    fontSize: 25, 
    width: 300, 
    paddingTop:30,
  },
  caixa: {
    fontSize: 20,
    marginTop: 26,
    borderWidth: 1,
    borderRadius:20,
    paddingLeft: 20,
    borderColor: '#4D4D4D',
  },
  botaoIndex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    marginTop: 170, 
    marginLeft: -50,
  },
  botao: {
    padding: 15,
    backgroundColor: "#EA003D",
    alignSelf: 'center',
    width:300,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 200,
  },
});