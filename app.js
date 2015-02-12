//donc je met var pour reduire le scope????
var MyApp = new Backbone.Marionette.Application();
//le lieu de l'aplication
MyApp.addRegions({
  mainRegion: "#liste"
});
// les elements qu'il y aura plusieurs fois, se sont des modeles
ListeElt=Backbone.Model.extend({
  //par defaut le numero est zero au cas ou
  defaults:{
    no:0
  }
});
//ici cest une collection de modeles
ListeCont=Backbone.Collection.extend({
  //lobjet quil va append 
	model:ListeElt,
  //au premier render
  initialize:function(phrases){
    var phraseToken=1;
    /*bon rajoutons un no comme attribut parce que
     * sinon je pense que ca aurait pu etre un for à cause 
     * de la var phrase token qui agit comme un i
     * , mais bon ca fonctionne lol
     */
    _.each(phrases,function(phrase){
      phrase.set('no',phraseToken);
      /*dans le tut le gars a incremente avant? 
      *preference ou bien il y a une bonne raison??
      * sinon, le ++ aurait pu etre fair sur un i lol
      */
      ++phraseToken;
    });

    //serieux jai oulie pourqui cet event
    /*
    MyApp.vent.on("phrase:detruire",function(phrase){
      alert("joie");
    });*/
  //  this.sort();

  }/*,
  comparator: function(phrase) {
    return phrase.get('no');
  },*/
});

//Ce que j'aimerais bien savoir, c'est pourquoi il y a des views.......
ListeEltView= Backbone.Marionette.ItemView.extend({
  //le tag où il apparaitra ainsi que ses attributs
  template: "#pointListe",
  tagName: 'tr',
  events:{
    'click a.nuke':'detruire'
  },
  detruire: function(){
    MyApp.vent.trigger('phrase:detruire',this.model);
    this.model.destroy();
  }
});


ListeContView= Backbone.Marionette.CompositeView.extend({
  //le tag où il apparaitra ainsi que ses attributs
  tagName: "table",
  template: "#listeTemplate",
  className: "table-striped table-bordered",
  itemView: ListeEltView,
  events:{

    'change input#newDo':'newDo'
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },newDo: function(){
   /*est-ce bien indenté????
    * Sinon en gros le this cest le collection on rentre dans ses enfants
    * on sarrange pour pogner le dernier attribut qui est son gamin le
    * plus recent .el pour prendre les elements dans litemview
    * et $('.phrase') n'a pas marché donc j'ai get by class name
    * comme il y a en theorie plusieurs elts dune classe, cest un array que ca retourne
    * je sais que dans ce tr il n'y en a qu'un dunc toujours le 0
    * et je prends la valeur de linput pour la mettre dans lhtml
    */
    if(MyApp.newLine){
      this.children[
        Object.keys(this.children)
          [Object.keys(this.children).length - 1]]
              .el
                .getElementsByClassName("phrase")[0]
                  .innerHTML= $("#newDo").val();
    }
  }

});



MyApp.addInitializer(function(options){
  var listeContView = new ListeContView({
    //pourquoi options.cats ???
    collection: options.laListe
  });
  //faire apparaitre lobjet dans l'html je supposeT
  MyApp.mainRegion.show(listeContView);
});

$(document).ready(function(){
  //jai pris la liberte de rajouter un attra MyApp pour eviter une var globale
  MyApp.newLine=false;
  var laListe= new ListeCont([
  								new ListeElt ({ reste_phrase :'un Texte'}),
  								new ListeElt ({ reste_phrase :'deux Textes'})
  							]);

	 MyApp.start({laListe:laListe});

   $(document).on('keypress',function(e){
    //si enter
    if(e.which === 13)
      MyApp.newLine = false;
    
   });

   //si le input est focuse
   $("#newDo").on("focus",function(){
      if(!MyApp.newLine){
        //rajouter un nouvelle liste vide avec le parametre no  (contrairement à ceux du start qui sont genere durant linitialize)
        laListe.add(new ListeElt({reste_phrase:" ",no:laListe.size()+1}));
        MyApp.newLine=true;
      }
   });
});
