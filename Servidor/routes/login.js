/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para medicos.

TO DO:
	=>Completar a endpoint para dados dos perfis de médico GET, PUT e DELETE.

*/

var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('../lib/mysqlWraper.js');
var pug = require('pug');
var mailSender = require('../lib/mailgunWraper.js');
var router = express.Router();

//Atributos médicos: 	
/*
idMedico
nome
especialidade
CRM
telefone
*/
router.route('/')
	.post(function(req, res){
		if (req.hasOwnProperty('body') &&
			req.body.hasOwnProperty('email') && 
			req.body.hasOwnProperty('senha')){
			
			mysql.getConnection(function(err, connection){	
			
				if (err) { return res.send('Erro de conexão com base de dados Login Post'); }
					
				getPatientQuery = {
					sql: `SELECT L.idMedico, M.nome FROM logins L, Medico M WHERE (L.email= ${connection.escape(req.body.email)} AND L.senha= ${connection.escape(req.body.senha)}) AND M.idMedico=L.idMedico`,
					timeout: 10000	
				}
				connection.query(getPatientQuery, function(err, rows, fields) {
			
					if (rows.length != 1) {res.send('Email ou senha incorretos ou algo a mais deu errado.');}
					else {
						res.json(rows[0]);
						console.log(err);
						console.log(rows);
						
						//console.log(fields);
					}
			
				});
			});
		} else {
			res.send('Escreva ambos email e senha para realizar o login');
		} 
	})
	.put(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('email')){
			
			mysql.getConnection(function(err,connection) {
			
				connection.query('SELECT idMedico FROM logins WHERE email=?',[req.body.email], function(err, rows) {
					console.log(rows);
					if (rows.length < 1) {
						return res.send(`O email ${req.body.email} não pertence a nenhuma conta cadastrada.`);
					}
				
					if (rows[0].emailConfirmado != 0) {

						var url = `http://julianop.com.br:3000/api/login/senha/change/${rows[0].idMedico}`;

						var verificationEmail = {
							to: req.body.email,
							subject: 'Mudança de Senha',
							html: `Segue o link para mudança de senha: ${url}`
						}
						mailSender(verificationEmail, function(err, body) {
							if(err){ return res.send('Erro ao enviar email'); }
							res.send('O email solicitado entrou na fila e chegará em breve.');
							console.log(body);
						});
					} else {
						res.send(`Confirme o endereço de email ${req.body.email} para habilitar a mudança de senha.`);
					}
				
				});
			});
				
		} else {
			res.send('Parâmetros inválidos');
		}
	});
	
router.get('/senha/change/:idMedico', function(req, res) {

	
	mysql.getConnection(function(err, connection) {
	
		if(err) { return res.send('Erro de conexão mudança senha'); }
	
		connection.query('SELECT * FROM logins WHERE idMedico=?',[req.params.idMedico], function(err,rows){
			if (rows.length < 1) { return res.send('id inexistente'); }
			if (rows[0].emailConfirmado != 0) {
				res.render('emailMudancaSenha');
			} else {
				res.send('Confirme o email da conta.');
			}
		});
	});
});

router.get('/senha/change/email/:email', function(req, res) {
	
	mysql.getConnection(function(err, connection){
	
		if(err) { return res.send('Erro de conexão mudança senha'); }

		connection.query('SELECT * FROM logins WHERE email=?',[req.params.email], function(err,rows){
			if (rows.length < 1) { return res.send('email inexistente'); }
			if (rows[0].emailConfirmado != 0) {
				res.render('emailMudancaSenha');
			} else {
				res.send('Confirme o email da conta.');
			}
		});
	});
});

router.post('/mudarSenha',function(req,res){
	
	mysql.getConnection(function(err, connection) {
		
		if (err) { return res.send('Erro de conexão mudança senha'); }
			
		connection.query('UPDATE logins SET senha=? WHERE email=?',[req.body.novaSenha, req.body.email],
			function(err, rows){
		
			if (err) { return res.send('Erro no armazenamento da nova senha.'); }
		
			res.send('Operação efetuada, caso as informações previas de email e senha estejam corretas a senha foi modificada.');
			
		});
	});
});


module.exports = router;







