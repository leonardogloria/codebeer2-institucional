
$(function() {
	var form = $('#main-contact-form');
   form.submit(function(e){
        e.preventDefault(e);
		var url = 'https://jd0l450ktg.execute-api.us-east-1.amazonaws.com/prod/api/sendmail'
		var form_status = $('<div class="form_status"></div>');
		form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Enviando Email, aguarde...</p>').fadeIn() );

		var person = {
	            nome: $("#nome").val(),
	            email:$("#email").val(),
	            mensagem:$("#mensagem").val()
	        }
		$.post( url, JSON.stringify(person) ,function( data ) {
		
		}).done(function(data){
			form_status.html('<p class="text-success">Obrigado por entrar em contato! Logo Responderemos</p>').delay(5000).fadeOut();

		}).fail(function(){
			form_status.html('<p class="has-error">Ops, Algo deu errado =/ . Tente novamente mais tarde</p>').delay(6000).fadeOut();
		});
	        //alert(person)
            
           
});
});
