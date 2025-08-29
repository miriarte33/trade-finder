import type { Player, Team } from '@/lib/types';

export interface TradeMatch {
  players: Player[];
  totalValue: number;
  valueDifference: number;
}

export interface TradeAnalysis {
  targetTeam: Team;
  possibleTrades: TradeMatch[];
}

const VALUE_TOLERANCE = 200;

export function generatePlayerCombinations(players: Player[], minPlayers: number = 1, maxPlayers: number = 3): Player[][] {
  const combinations: Player[][] = [];
  
  function generateCombos(startIndex: number, currentCombo: Player[]) {
    if (currentCombo.length >= minPlayers && currentCombo.length <= maxPlayers) {
      combinations.push([...currentCombo]);
    }
    
    if (currentCombo.length >= maxPlayers) {
      return;
    }
    
    for (let i = startIndex; i < players.length; i++) {
      currentCombo.push(players[i]);
      generateCombos(i + 1, currentCombo);
      currentCombo.pop();
    }
  }
  
  generateCombos(0, []);
  return combinations;
}

export function calculateTotalValue(players: Player[]): number {
  return players.reduce((total, player) => total + player.value, 0);
}

export function findPossibleTrades(
  selectedPlayers: Player[],
  targetTeam: Team,
  maxCombinationSize: number = 3
): TradeMatch[] {
  const selectedValue = calculateTotalValue(selectedPlayers);
  const playerCombinations = generatePlayerCombinations(targetTeam.players, 1, maxCombinationSize);
  
  const validTrades: TradeMatch[] = [];
  
  for (const combination of playerCombinations) {
    const combinationValue = calculateTotalValue(combination);
    const valueDifference = Math.abs(selectedValue - combinationValue);
    
    if (valueDifference <= VALUE_TOLERANCE) {
      validTrades.push({
        players: combination,
        totalValue: combinationValue,
        valueDifference,
      });
    }
  }
  
  return validTrades.sort((a, b) => a.valueDifference - b.valueDifference);
}

export function analyzeTradesForAllTeams(
  selectedPlayers: Player[],
  allTeams: Team[],
  sourceTeamId: string,
  targetTeamIds?: string[]
): TradeAnalysis[] {
  const analyses: TradeAnalysis[] = [];
  
  for (const team of allTeams) {
    if (team.ownerId === sourceTeamId) {
      continue;
    }
    
    if (targetTeamIds && !targetTeamIds.includes(team.ownerId)) {
      continue;
    }
    
    const possibleTrades = findPossibleTrades(selectedPlayers, team);
    
    if (possibleTrades.length > 0) {
      analyses.push({
        targetTeam: team,
        possibleTrades,
      });
    }
  }
  
  return analyses;
}