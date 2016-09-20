$(document).ready(function(){
    //--------------DELETE Genre----------------------------
    $('.delete-genre').on('click', function(){
        // id taken from data-id <a> in index.js
        var id = $(this).data('id');
        var url = '/genres/delete/' + id;

        if (confirm('Delete Genre?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting genre...');
                    window.location.href="/genres";
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    //--------------DELETE Album----------------------------
    $('.delete-album').on('click', function(){
        console.log("---------delete-album pressed--------");
        // id taken from data-id <a> in index.js
        var id = $(this).data('id');
        var url = '/albums/delete/' + id;

        if (confirm('Delete Album?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting album...');
                    window.location.href="/albums";
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });
});

console.log("my JS loaded!");
