:- consult('menuGame.pl').
:- consult('clobberDisplay.pl').
:- consult('clobberLogica.pl').
:- consult('utilities.pl').
:- consult('input.pl').
:- consult('botsLogic.pl').
:- consult('ai.pl').
:- use_module(library(between)).
:- use_module(library(random)).
:- use_module(library(system)).
:- use_module(library(lists)).

/**
 * @brief lanca o jogo
 */
play :-
      mainMenu.

