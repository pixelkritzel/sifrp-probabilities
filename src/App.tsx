import React from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { generateRolls } from './generateRolls';

type store = {
  sides: number;
  dices: number;
  boni: number;
  penalty: number;
  modifiers: number;
  goal: number;
};

@observer
export default class App extends React.Component {
  @observable
  store: store = {
    sides: 6,
    dices: 2,
    boni: 1,
    penalty: 0,
    modifiers: 0,
    goal: 12
  };

  @computed
  get rolls() {
    if (this.store.sides === 0 || this.store.dices === 0) {
      return [];
    }
    return generateRolls(this.store.sides, this.store.dices + this.store.boni);
  }

  @computed
  get successes() {
    return this.rolls.filter((roll: number[]) => {
      return (
        [...roll]
          .sort((a, b) => b - a)
          .slice(0, this.store.dices - this.store.penalty)
          .reduce((prev, curr) => {
            return prev + curr + this.store.modifiers;
          }, 0) >
        this.store.goal - 1
      );
    });
  }

  set = (name: keyof store, value: number) => {
    this.store[name] = value;
  };

  render() {
    return (
      <>
        <CssBaseline />
        <Container maxWidth="sm">
          <Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  value={this.store.sides}
                  label="Sides of Dices"
                  onChange={event => this.set('sides', Number(event.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  value={this.store.dices}
                  label="Number of Dices"
                  onChange={event => this.set('dices', Number(event.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  value={this.store.boni}
                  label="Bonus Dices"
                  onChange={event => this.set('boni', Number(event.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  value={this.store.penalty}
                  label="Penalty Dices"
                  onChange={event => this.set('penalty', Number(event.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  value={this.store.modifiers}
                  label="Modifier"
                  onChange={event => this.set('modifiers', Number(event.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Result to achieve"
                  value={this.store.goal}
                  onChange={event => this.set('goal', Number(event.target.value))}
                />
              </Grid>
            </Grid>
            <h2>Result</h2>
            <p>Possible rolls: {this.rolls.length}</p>
            <p>Succesful rolls: {this.successes.length}</p>
            <p>Probability of sucess: {((this.successes.length / this.rolls.length) * 100).toFixed()}</p>
          </Typography>
        </Container>
      </>
    );
  }
}
