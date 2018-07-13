const mongo = require('../lib/mongodb');
const { assert } = require('chai');
const request = require('./request');

describe('Players API', () => {
    let savedPlayers = [];

    beforeEach(() => {
        savedPlayers = [];
        return mongo.then(db => {
            db.collection('leaderboards').remove();
        });
    });


    const save = player => {
        return request
            .post('/players')
            .send(player)
            .then(({ body }) => {
                assert.ok(body._id);
                assert.equal(body.name, player.name);
                savedPlayers.push(body);
            });
    };
    
    beforeEach(() => {
        return save({
            name: 'Injoong',
            kills: 0,
            wins: 1
        });
    });
    beforeEach(() => {
        return save({
            name: 'Arthur',
            kills: 10,
            wins: 2
        });
    });

    it('returns 404 on bad url', () => {
        return request
            .get('/bad')
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

    it('gets players', () => {
        return request
            .get('/players')
            .then(({ body }) => {
                assert.deepEqual(body, savedPlayers);
            });
    });

    it('gets a player by id', () => {
        return request
            .get(`/players/${savedPlayers[0]._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, savedPlayers[0]);
            });
    });
});