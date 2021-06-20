var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');
 
var app = express();
 
app.use(express.urlencoded());
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appsy',
    port: 3306
}

app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/home', function(req, res){
    res.render('home');
});

app.get('/dodaj', function(req, res){
    res.render('dodaj');
});

app.post('/dodaj', function(req, res){
    var ksiazka={
        Tytul: req.body.Tytul,
        Autor: req.body.Autor,
    }
	
    req.getConnection(function(error, conn){
        conn.query('INSERT INTO ksiazka SET ?',ksiazka,function(err, rows){
            if(err){
                var message='Coś poszło nie tak spróbuj ponownie ' + err
            }else{
                var message='Pomyslnie dodano ksiazke do zbioru'
            }
 
             res.render('dodaj',{
                 message:message
             });
         });
    });
});

app.get('/lista', function(req, res){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
             res.render('lista',{
                listaksiazek: listaksiazek
            });
        });
    });
});

app.get('/usun', function(req, res){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
             res.render('usun',{
                listaksiazek: listaksiazek
            });
        });
    });
});


app.post('/usun', function(req, res){
    let tytul = req.body.UsunKsiazke;
    var message = "";
	
    req.getConnection(function(error, conn){
        conn.query('DELETE FROM ksiazka WHERE tytul=' + tytul,function(err, rows){
            if(err){
                message='Coś poszło nie tak spróbuj ponownie '
            }else{
                message='Pomyślnie usunięto'
            }     
         });
    });
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
            res.render('usun',{
                listaksiazek: listaksiazek,
                message:message
            });
        });
    });
});

app.post('/wypisz', function(req, res){
    var listaksiazek;
    let tytul = req.body.edytuj;
	
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka WHERE tytul=' + tytul,function(err, rows){
            listaksiazek=rows;
            res.render('wypisz',{
                listaksiazek: listaksiazek,
            });
        });
    });
});

app.post('/akcja', function(req, res){
    var message = "";
    var ksiazka={
        tytul: req.body.tytul,
        autor: req.body.Rasa,
    }
	
    req.getConnection(function(error, conn){
        conn.query('UPDATE ksiazka SET tytul="' + ksiazka.tytul + '", autor="' + ksiazka.autor + '"WHERE tytul=' + ksiazka.tytul,function(err, rows){
            if(err){
                var message='Wystąpił błąd ' + err
            }else{
                var message='Zmodyfikowano ksaizke'
            }
         });
    });
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
            res.render('edytuj',{
                listaksiazek: listaksiazek,
                message:message
            });
        });
    });
});

app.get('/edytuj', function(req, res){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
            console.log(listaksiazek);
             res.render('edytuj',{
                listaksiazek: listaksiazek
            });
        });
    });
});

app.post('/edytuj', function(req, res){
    req.getConnection(function(error, conn){
        
        conn.query('SELECT * FROM ksiazka',function(err, rows){
            var listaksiazek=rows;
            
             res.render('edytuj',{
                listaksiazek: listaksiazek
            });
        });
    });
});



app.listen(3001);