const should = require('should')
const split= require('../logFilters/spliter').split;

const spigot18 = [
  {
    input: '[13:47:10 INFO]: Done (9.617s)! For help, type "help" or "?"',
    expected: {
      time: '13:47:10',
      level: 'INFO',
      message: 'Done (9.617s)! For help, type "help" or "?"'
  }}, {
    input: '[13:46:26 WARN]: Failed to load eula.txt',
    expected: {
      time: '13:46:26',
      level: 'WARN',
      message: 'Failed to load eula.txt'
  }}, {
    input: '[13:47:00 INFO]: 	Replace Blocks: [1, 5]',
    expected: {
      time: '13:47:00',
      level: 'INFO',
      message: '	Replace Blocks: [1, 5]'
  }}
]
const vanilla1122 = [
  {
    input: '[16:08:29] [Server thread/INFO]: Done (1.629s)! For help, type "help" or "?"',
    expected: {
      time: '16:08:29',
      level: 'INFO',
      message: 'Done (1.629s)! For help, type "help" or "?"'
  }}, {
    input: '[14:20:01] [Server thread/INFO]: There are 0/20 players online',
    expected: {
      time: '14:20:01',
      level: 'INFO',
      message: 'There are 0/20 players online'
  }}, {
    input: '[14:21:03] [Server thread/INFO]: [NXG_Navigater: Set own game mode to Creative Mode]',
    expected: {
      time: '14:21:03',
      level: 'INFO',
      message: '[NXG_Navigater: Set own game mode to Creative Mode]'
  }}, {
    input: '[14:32:34] [Server Shutdown Thread/INFO]: Stopping server',
    expected: {
      time: '14:32:34',
      level: 'INFO',
      message: 'Stopping server'
  }}
]

describe('test spliter for spigot 1.8', () => {

  spigot18.forEach((item) => {
    it('should return a splited log', done => {
      split(item.input).should.deepEqual(item.expected);
      done()
    })
  })
})

describe('test spliter for vanilla 1.12.2', () => {

  vanilla1122.forEach((item) => {
    it('should return a splited log', done => {
      split(item.input).should.deepEqual(item.expected);
      done()
    })
  })
})
