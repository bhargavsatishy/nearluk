var bb = require('bluebird');
var fs = require('fs');
var exports = module.exports={};
var initOptions = {
    promiseLib: bb,
    noLocking: true,
    error(error, e) {
        if (e.cn) {
            // A connection-related error\
            console.log('EVENT:', error.message || error);
        }
    },
    query: function (q) {
        sql=q.query;
        if (q.params) {
            sql+='\nPARAMS:'+q.params
        }
        fs.appendFileSync(__dirname + '/sql/db.log', '\n[SQLQuery]>> ' + sql, 'utf8', (err) => {
            if (err)
                console.log(err)
            else {}
        });
    }
}
var config = require(__dirname + '/apiconfig');
var pgp = require('pg-promise')(initOptions);
var cs = config.dba;
var dbc = pgp(cs);
exports.log=function logger(logContent) {
    fs.appendFileSync(__dirname + '/sql/db.log', '\n' + logContent, 'utf8', (err) => {
        if (err)
            console.log(err)
        else {}
    });
};
exports.db = dbc;