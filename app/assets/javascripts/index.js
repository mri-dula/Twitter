var MAX_TAGS=10;
var MOPEDS_PER_PAGE=10;
var qs=(function(b){if(b==""){return{}
}var a={};
for(var e=0;
e<b.length;
++e){var c=b[e].split("=");
if(c.length==2){var d=c[0];
var f=c[1];
a[d]=decodeURIComponent(f.replace(/\+/g," "))
}}return a
})(window.location.search.substr(1).split("&"));
var setQSParam=function(a,k,j){var f=a.indexOf("?"),c=[k,j].join("=");
if(f>-1){var g=a.substr(0,f),d=a.substr(f+1).split("&"),b=true,e;
for(e=0;
e<d.length;
e++){var h=d[e].split("=");
if(h[0]==k){b=false;
d[e]=c;
break
}}if(b){d.push(c)
}return[g,d.join("&")].join("?")
}else{return[a,c].join("?")
}};
$(document).ready(function(){humane.timeout=2500;
humane.waitForMove=true;
humane.forceNew=false;
humane.clickToClose=false;
humane.action=humane.create({type:"action",clickToClose:true,waitForMove:false,timeout:15000});
$("body").on("click",".humane .reply",function(){var a="@"+$(this).data("user")+" ";
$("textarea.thing").focus().val(a)
})
});
function togglePlaceholder(c){var b=$(c).prop("name");
var a=$('label[for="'+b+'"].ph');
$(c).val()==""?$(a).show():$(a).hide()
}function activatePlaceholders(){$(document).ready(function(){$(".row .phfield").each(function(){togglePlaceholder(this)
});
$("label.ph").click(function(){var a=$(this).prop("for");
$('.phfield[name="'+a+'"]').focus()
});
$(".phfield").keyup(function(){togglePlaceholder(this)
});
$(".phfield").blur(function(){togglePlaceholder(this)
})
})
}$.fn.setCursorPosition=function(a){this.each(function(c,d){if(d.setSelectionRange){d.setSelectionRange(a,a)
}else{if(d.createTextRange){var b=d.createTextRange();
b.collapse(true);
b.moveEnd("character",a);
b.moveStart("character",a);
b.select()
}}});
return this
};
var formatTimestamp=function(b){var a=function(c){var d=moment(c*1000);
return d.fromNow()
};
return a(b)
};
var nameValueListToDictionary=function(a){return _.reduce(a,function(b,c){b[c.name]=c.value;
return b
},{})
};
var UserSession=Backbone.Model.extend({urlRoot:"/api/v1/auth",idAttribute:"dummy",initialize:function(){var a=["id","apikey","username","email","display_name","image","kli"];
this.bind("change",this.change_,this);
this.set(this.get_cookies(a),{silent:true})
},auth:function(b,a){this.save({email:b.email,password:b.password},a)
},logged_in:function(){return !!this.get("id")
},get_cookies:function(a){return _.reduce(a,function(b,c){b[c]=$.cookie(c,{domain:DOMAIN,path:"/"});
return b
},{})
},set_cookies:function(b,a){_.each(b,function(d,c){$.cookie(c,d,{domain:DOMAIN,path:"/",expires:a})
})
},change_:function(){var b={id:this.get("id"),apikey:this.get("apikey"),username:this.get("username"),email:this.get("email"),image:this.get("image"),display_name:this.get("display_name"),kli:this.get("kli")},a=this.get("kli")==="1"?365:null;
this.set_cookies(b,a)
},});
window.userSession=new UserSession();
$(document).ready(function(){Handlebars.registerHelper("timestamp",function(){return formatTimestamp(this.created_at_int)
});
Handlebars.registerHelper("twitter_image",function(f,e){var g=e.hash.size,h=f.lastIndexOf("normal");
if(h>-1){var d=f.substring(0,h),c=f.substring(h+6);
return d+g+c
}else{return f
}});
Handlebars.registerHelper("moped_type",function(c){if(typeof c[0]!="undefined"){return"message"
}else{return"note"
}});
var a=function(f,j){var c=[],k=0;
for(var d=0;
d<j.length;
d++){var e=f.substr(k,j[d].start-k);
if(e.length>0){c.push(e)
}var h=f.substr(j[d].start,j[d].end-j[d].start);
c.push(j[d]);
k=j[d].end
}var g=f.substr(k);
if(g.length>0){c.push(g)
}return c
};
var b=function(d){_.each(["http://www.","https://www.","http://","https://","www."],function(e){d=d.replace(e,"")
});
var c=d.indexOf("/");
if(c>-1&&d.substr(c).length>20){d=d.substr(0,c+20)+"..."
}return d
};
Handlebars.registerHelper("linkify",function(f,j,e,d){var h=[],i=[],g=[];
if(f.match(/<a.*>.*<\/a>/)){return f
}_.each(j,function(k){_.each(k.indices,function(l){i.push({type:"topic",start:l[0],end:l[1],name:k.name,slug:k.slug})
})
});
_.each(e,function(k){_.each(k.indices,function(l){i.push({type:"person",start:l[0],end:l[1],username:k.username,name:k.name})
});
h.push(k.username)
});
_.each(d,function(k){_.each(k.indices,function(l){i.push({type:"link",start:l.start,end:l.end,text:k.text,url:k.url})
})
});
i=_.sortBy(i,function(k){return k.start
});
g=a(f,i);
var c=_.reduce(g,function(k,l){if(l.type=="topic"){l='<a class="filter tag" href="#tag/'+l.slug+'">#'+l.name+"</a>"
}else{if(l.type=="person"){if(_.include(h,l.username)){l='<a class="filter user" href="#user/'+l.username+'">@'+l.username+"</a>"
}}else{if(l.type=="link"){var n=b(l.text),m=(l.url.indexOf("mailto:")==0)?"":' target="_blank"';
l='<a href="'+l.url+'"'+m+">"+n+"</a>"
}else{}}}return k+l
},"");
return c
})
});
var Moped=Backbone.Model.extend({url:function(){if(this.isNew()){return"/api/v1/moped"
}else{return this.get("resource_uri")||this.collection.url()
}}});
var UserProfile=Backbone.Model.extend({urlRoot:"/api/v1/profiles",initialize:function(){this.bind("change:display_name",this.changeDisplayName,this)
},changeDisplayName:function(b,c,a){userSession.set({display_name:c})
}});
var User=Backbone.Model.extend({urlRoot:"/api/v1/user",initialize:function(){this.bind("change:email",this.changeEmail,this)
},changeEmail:function(a,c,b){userSession.set({email:c})
}});
var Tag=Backbone.Model.extend({urlRoot:"/api/v1/tags",select:function(){_.each(this.collection.models,function(a){if(a.get("selected")){a.set({selected:false})
}});
this.set({selected:true})
},});
var Name=Backbone.Model.extend({select:function(){_.each(this.collection.models,function(a){if(a.get("selected")){a.set({selected:false})
}});
this.set({selected:true})
}});
var Relationship=Backbone.Model.extend({});
var Notification=Backbone.Model.extend({});
var NameList=Backbone.Collection.extend({model:Name,url:"/api/v1/mentions",parse:function(a){return a.objects
},comparator:function(a){return a.get("username").toLowerCase()
}});
window.Names=new NameList();
var TagList=Backbone.Collection.extend({model:Tag,url:"/api/v1/tags",parse:function(a){return a.objects
},comparator:function(a){return -a.get("count")
}});
window.Tags=new TagList();
var RelationshipList=Backbone.Collection.extend({model:Relationship,url:"/api/v1/relationships",parse:function(a){return a.objects
},});
window.Relationships=new RelationshipList();
var MopedList=Backbone.Collection.extend({model:Moped,initialize:function(a){a||(a={});
this.search=a.search
},url:function(){if(this.search){return"/api/v1/moped/search?q="+encodeURIComponent(this.search)
}else{return"/api/v1/moped"
}},parse:function(a){return a.objects
},comparator:function(a){return -a.get("created_at_int")
}});
window.Mopeds=new MopedList();
var NotificationList=Backbone.Collection.extend({model:Notification,url:"/api/v1/notifications",parse:function(a){return a.objects
},});
$(function(){var c=Backbone.View.extend({tagName:"li",template:Handlebars.compile($("#name-template").html()),events:{"click a.filter":"open"},initialize:function(d){this.model.unbind();
this.model.bind("change:selected",this.highlight,this);
this.model.bind("change:count",this.remove,this);
this.list=d.list
},render:function(){$(this.el).html(this.template(this.model.toJSON()));
return this
},open:function(d){d.preventDefault();
$("#loading-status").waypoint("destroy");
$("#tags a.filter").removeClass("active");
this.list.homeView.collection.search=undefined;
if(!$(d.currentTarget).hasClass("active")){this.model.select();
var f=this.model.get("username");
this.list.homeView.mopedFeed.load({person:f});
router.navigate("user/"+f);
this.list.homeView.setFeedTitle(f,"user")
}else{$(d.currentTarget).removeClass("active");
this.list.homeView.mopedFeed.load();
router.navigate("");
this.list.homeView.setFeedTitle("")
}},highlight:function(d,e){var f=$("a.filter",this.el);
if(e){f.addClass("active")
}else{f.removeClass("active")
}},remove:function(d,e){if(e<=0){this.model.collection.remove(d);
$(this.el).animate({opacity:0},200).slideUp(200,function(){$(this.el).remove()
})
}}});
window.NameView=Backbone.View.extend({initialize:function(){this.currentUsername=this.options.username;
this.collection=new NameList();
this.collection.bind("add",this.addName,this);
this.collection.bind("reset",this.reset,this);
this.collection.fetch()
},addName:function(d){var e=new c({model:d,list:this});
$(this.el).append(e.render().el);
this.collection.sort()
},reset:function(g){var d=null,f="";
var e=g.map(function(i){if(i.get("username")===this.currentUsername){d=i
}var h=new c({model:i,list:this});
return h.render().el
},this);
$("#names").html(e);
this.render();
if(d){d.select();
f=d.get("username")
}else{f=this.currentUsername
}if(f){this.homeView.setFeedTitle(f,"user")
}},});
var a=Backbone.View.extend({tagName:"li",className:"moped cf",template:Handlebars.compile($("#moped-template").html()),events:{"click .remove":"remove","click .reply":"reply"},initialize:function(d){this.model.bind("change",this.render,this);
this.list=d.list
},render:function(){var d=this.model.toJSON();
$(this.el).html(this.template(d));
return this
},reply:function(h){var f=this.model.get("creator").username,g=userSession.get("username"),d=$("textarea[name=thing]"),i="";
if(f!=g){i="@"+f+" "
}_.each(this.model.get("names"),function(e){if(e.username!=g&&e.username!=f){i+="@"+e.username+" "
}});
if(this.model.get("tags").length>0){i+=" ";
_.each(this.model.get("tags"),function(e){i+="#"+e.name+" "
})
}d.focus().val(i);
if(i.indexOf("#")>-1){d.focus().setCursorPosition(i.indexOf("#")-1).focus()
}$("input.save, button.clear").removeClass("inactive");
window.scrollTo(0,0)
},remove:function(){$(this.el).unbind("click");
_.each(this.model.get("tags"),function(e){var d=this.list.homeView.tagView.collection.get(e.id);
if(d){var f=d.get("count");
d.set({count:f-e.count})
}},this);
_.each(this.model.get("names"),function(f){var d=this.list.homeView.nameView.collection.get(f.id);
if(d){var e=d.get("count");
d.set({count:e-f.count})
}},this);
this.model.destroy();
$(this.el).animate({opacity:0},200).slideUp(150,function(){$(this).remove()
})
},});
window.MopedListView=Backbone.View.extend({el:"#mopeds",initialize:function(){this.collection.bind("add",this.addOne,this);
this.collection.bind("reset",this.addAll,this);
this.collection.bind("remove",this.remove,this);
this.load(this.options)
},load:function(d){var e=this,f={limit:MOPEDS_PER_PAGE,offset:0};
d=d||{};
this.next_offset=MOPEDS_PER_PAGE;
$("#mopeds").empty();
this._load(d,f)
},_load:function(d,f){var e=this;
if(d.tag||d.person){if(d.tag){f.tags__slug__iexact=d.tag
}if(d.person){f.people__username__iexact=d.person
}}else{if(d.moped){f.id=d.moped
}}this.collection.fetch({data:f,success:function(h,g){if(g.meta.total_count==0){$("#mopeds").append('<li class="no-results">No messages found.</li>')
}if(d.moped){return
}if(g.meta.total_count>MOPEDS_PER_PAGE){$("#loading-status").waypoint(function(i,j){if(j==="down"){e.loadMore(d)
}},{offset:"100%"})
}}})
},_addTags:function(d){var e=this.homeView.tagView.collection,f=e.pluck("slug");
_.each(d.get("tags"),function(g){if(!_.include(f,g.slug)){e.add(g)
}else{var h=e.get(g.id),i=h.get("count");
h.set({count:i+g.count})
}},this)
},_addNames:function(d){var f=this.homeView.nameView.collection,e=f.pluck("username");
_.each(d.get("names"),function(g){if(!_.include(e,g.username)){var h=new Name({id:g.id,username:g.username,count:g.count});
f.add(h)
}else{var j=f.get(g.id),i=j.get("count");
j.set({count:i+g.count},{silent:true})
}},this)
},addOne:function(i,j,g){if($("#mopeds li.no-results").length){$("#mopeds li.no-results").remove()
}var d=new a({model:i,list:this}),h=d.render().el;
if(g.created){$("#mopeds").prepend(h);
if(i.get("tags").length>0){this._addTags(i)
}if(i.get("names").length>0){this._addNames(i)
}if(i.has("invitation_status")){var e=i.get("invitation_status");
for(email in e){switch(e[email].status){case"user_exists":var k=e[email].username,f=e[email].display_name;
humane.action("<strong>"+f+"</strong> (@"+k+') is already using Moped! <a href="#" class="reply" data-user="'+k+'">Send a message.</a>');
break;
case"invitation_exists":humane.error("<strong>"+email+"</strong> has already been invited!");
break;
case"sent":humane.success("Invitation sent to <strong>"+email+"</strong>");
break
}}}this.next_offset+=1
}else{$("#mopeds").append(h)
}},addAll:function(e,d){$("#mopeds").empty();
e.each(function(f){this.addOne(f,e,{})
},this);
setInterval(function(){$(".timestamp").each(function(g,j){var f=$(j),h=f.attr("data-time");
f.text(formatTimestamp(parseInt(h,10)))
})
},30000)
},remove:function(d,e){if(e.length==0){$("#mopeds").append('<li class="no-results">No messages found.</li>')
}this.next_offset-=1;
$.waypoints("refresh")
},loadMore:function(d){var e=this,f={limit:MOPEDS_PER_PAGE,offset:this.next_offset};
$("#loading-status").animate({opacity:1},200);
if(d.tag||d.person){if(d.tag){f.tags__slug__iexact=d.tag
}if(d.person){f.people__username__iexact=d.person
}}this.collection.fetch({add:true,data:f,success:function(i,g){var h=g.meta.total_count-e.next_offset;
if(h>=MOPEDS_PER_PAGE){e.next_offset+=MOPEDS_PER_PAGE;
$.waypoints("refresh")
}else{e.next_offset+=h;
$("#loading-status").waypoint("destroy")
}$("#loading-status").animate({opacity:0},0)
}})
},});
window.NotificationListView=Backbone.View.extend({el:"#notifications",events:{mouseout:"markAllAsRead"},initialize:function(){var d=this;
this.collection=new NotificationList();
this.collection.bind("add",this.addOne,this);
this.collection.bind("reset",this.addAll,this);
this.collection.fetch({data:{limit:8}});
$(document).unbind("newNotification").bind("newNotification",function(i,g){var h=new Notification(g);
h.pushed=true;
d.collection.add(h);
d.toggleOn();
$(d.el).find("#no-notifications").remove();
if(h.get("notification_type")==="j"){var f=nameValueListToDictionary(h.get("fields"));
window.usernames.push({name:f.username,display_name:f.display_name,image:f.image})
}})
},addOne:function(d){var e=new b({model:d});
if(d.pushed){$(this.el).find("a").after(e.render().el)
}else{$(this.el).append(e.render().el)
}},addAll:function(f){var e=f.any(function(h){return h.get("marked_read_at")==null
}),g=0,d=f.filter(function(h){return ++g<=5||h.get("marked_read_at")==null
},this);
$(this.el).find(".notification").remove();
_.each(d,function(h){this.addOne(h)
},this);
if(e){this.toggleOn()
}if(f.length>0){$(this.el).find("#no-notifications").remove()
}},toggleOn:function(){$(this.el).addClass("on")
},toggleOff:function(){$(this.el).removeClass("on")
},markAllAsRead:function(){var d=this.collection.filter(function(f){return f.get("marked_read_at")==null
}),e=new Date();
_.each(d,function(f){f.save({marked_read_at:e})
});
$(this.el).addClass("read");
this.toggleOff()
},});
var b=Backbone.View.extend({template:Handlebars.compile($("#friend-joined-template").html()),tagName:"li",className:"notification",getTextTemplate:function(d){switch(d){case"j":return"@%(username)s (%(display_name)s) joined Moped."
}},render:function(){var g=this.model.toJSON(),f=$(this.el),e=this.getTextTemplate(g.notification_type),d=nameValueListToDictionary(g.fields);
g.text=_.str.sprintf(e,d);
f.attr("id","notification-"+this.model.id);
if(g.marked_read_at!=null){f.addClass("read")
}$(this.el).html(this.template(g));
return this
}})
});
$(function(){$.ajaxSetup({beforeSend:function(i,h){window.loading=$("header .loading");
h.url=API_BASE_URL+h.url;
if(userSession.logged_in()){i.setRequestHeader("X-MOPED-USER-ID",userSession.get("id"));
i.setRequestHeader("X-MOPED-APIKEY",userSession.get("apikey"))
}$(loading).animate({opacity:1},200)
},complete:function(){$(loading).animate({opacity:0},200)
}});
var f=Backbone.View.extend({tagName:"li",template:Handlebars.compile($("#tag-template").html()),events:{"click a.filter":"open"},initialize:function(h){this.model.unbind();
this.model.bind("change:selected",this.highlight,this);
this.model.bind("change:count",this.remove,this);
this.list=h.list
},render:function(){$(this.el).html(this.template(this.model.toJSON()));
return this
},open:function(i){i.preventDefault();
$("#loading-status").waypoint("destroy");
$("#names a.filter").removeClass("active");
this.list.homeView.collection.search=undefined;
if(!$(i.currentTarget).hasClass("active")){this.model.select();
var h=this.model.get("slug");
this.list.homeView.mopedFeed.load({tag:h});
router.navigate("tag/"+h);
this.list.homeView.setFeedTitle(this.model.get("name"),"tag")
}else{$(i.currentTarget).removeClass("active");
this.list.homeView.mopedFeed.load();
router.navigate("");
this.list.homeView.setFeedTitle("")
}},highlight:function(h,i){if(i){$("a.filter",this.el).addClass("active")
}else{$("a.filter",this.el).removeClass("active")
}},remove:function(h,i){if(i<=0){this.model.collection.remove(h);
$(this.el).animate({opacity:0},200).slideUp(200,function(){$(this.el).remove()
})
}}});
var b=Backbone.View.extend({initialize:function(){this.currentSlug=this.options.slug;
this.collection=new TagList();
this.collection.bind("add",this.addTag,this);
this.collection.bind("reset",this.reset,this);
this.collection.fetch()
},addTag:function(h){var i=new f({model:h,list:this});
$(this.el).append(i.render().el);
this.collection.sort()
},sortTags:function(h){var j=h.get("name").toLowerCase(),i=100-h.get("count");
if(i<10){j="00"+i+j
}else{j="0"+i+j
}return j
},reset:function(l){var k=null,i=_.first(l.sortBy(this.sortTags),MAX_TAGS),h=_.sortBy(i,function(m){return m.get("name").toLowerCase()
});
var j=h.map(function(m){if(!k&&m.get("slug")==this.currentSlug){k=m
}var n=new f({model:m,list:this});
return n.render().el
},this);
$("#tags").html(j);
this.render();
if(k){k.select();
this.homeView.setFeedTitle(k.get("name"),"tag")
}},});
var d=Backbone.View.extend({el:"#header",initialize:function(){var h=this;
this.parent=this.options.parent;
this.$search=$("input[type=search]");
$(document).unbind("keypress").bind("keypress",function(j){h.keypress(j)
});
this.notifications=new NotificationListView();
var i=userSession.get("image");
$('header[role="banner"] img.user-image').attr("src",i);
this.$search.asuggest(function(){return h.createSuggestions()
},{delimiters:" ",ignoreCase:true,minChunkSize:2})
},events:function(){$(this.el).unbind();
return{"click .home":"refreshFeed","keypress input[type=search]":"search","blur input[type=search]":"clearSearch",'click ul.dropdown[data-dropdown-action="click"] > a':"dropdown"}
},dropdown:function(h){var i=$(h.currentTarget).parent("ul");
if($(i).hasClass("open")){$(i).removeClass("open");
$("body").off("click")
}else{$(i).addClass("open");
$("body").on("click",function(j){if(!$(j.target).closest(i).length||$(j.target).closest("ul.dropdown li").length){$(i).removeClass("open")
}})
}},search:function(j){if(j.which===13){var h=this.$search.val();
if(h.indexOf("@")!=-1){$(document).trigger("track_search","@")
}if(h.indexOf("#")!=-1){$(document).trigger("track_search","#")
}var i=encodeURIComponent(_.str.rtrim(this.$search.val()));
router.navigate("search/"+i,true)
}},keypress:function(h){if(h.which===47){if(!this.$search.is(":focus")&&!$("textarea.thing").is(":focus")){h.preventDefault();
this.$search.focus()
}}},clearSearch:function(){this.$search.val("")
},createSuggestions:function(){var i=_.map(window.usernames,function(j){return"@"+j.name
}),h=this.parent.tagView.collection.map(function(j){return"#"+j.get("name")
});
return i.concat(h)
},refreshFeed:function(h){h.preventDefault();
if(Backbone.history.fragment==="account"||Backbone.history.fragment==="people"){router.navigate("",true)
}else{this.parent.clearNewMopeds();
this.parent.mopedFeed.collection.search=undefined;
this.parent.mopedFeed.load();
this.parent.setFeedTitle("");
$("#tags a.filter").removeClass("active");
$("#names a.filter").removeClass("active");
router.navigate("")
}},});
var c=Backbone.View.extend({id:"home",tagName:"div",template:Handlebars.compile($("#home-template").html()),events:{"click button.save":"initialValidation","focus textarea.thing":"focusThing","click #show-new-mopeds":"showNewMopeds","keyup textarea.thing":"checkSaveActive"},initialize:function(){this.mopedFeed=new MopedListView(this.options);
this.mopedFeed.homeView=this;
this.tagView=new b({slug:this.options.tag});
this.tagView.homeView=this;
this.nameView=new NameView({username:this.options.person});
this.nameView.homeView=this;
this.header=new d({parent:this});
this.header.parent=this
},showNewMopeds:function(h){h.preventDefault();
_.each(new_mopeds,function(i){this.collection.add(i)
},this);
this.collection.sort();
this.clearNewMopeds()
},clearNewMopeds:function(){new_mopeds=[];
$("#new-moped-text").text("no new mopeds");
$("#show-new-mopeds").hide();
$("title").text("Moped");
$.faviconNotify("/img/favicon.png")
},setFeedTitle:function(j,h){$("a.feedtitle").removeClass("search tag user");
if(h){$("a.feedtitle").addClass(h)
}if(j===""){$("a.feedtitle").hide()
}else{$("a.feedtitle").show()
}var i="";
if(h=="tag"){i="#"
}if(h=="user"){i="@"
}$("a.feedtitle .name").text(i+j)
},render:function(){var i=this;
$(this.el).html(this.template(userSession.toJSON()));
this.input=this.$("textarea.thing");
this.input.autocomplete({container:".suggest",getSuggestions:function(l,k){if(k===64){return _.map(window.usernames,function(m){var n=m.name+m.display_name;
m.score=n.score(l);
return m
})
}else{return i.tagView.collection.map(function(m){return{name:m.get("name"),score:m.get("name").score(l)}
})
}}}).bind("autocomplete.done",function(){$(document).trigger("create_return");
i.initialValidation()
});
var j="";
var h="";
if(this.options.tag||this.options.person){if(this.options.tag){h="tag";
j="#"+this.options.tag
}else{h="user";
j="@"+this.options.person
}}this.setFeedTitle(j,h);
this.$("a.feedtitle").click(function(k){k.preventDefault();
$("#loading-status").waypoint("destroy");
$("#tags a.filter").removeClass("active");
$("#names a.filter").removeClass("active");
i.mopedFeed.collection.search=undefined;
i.mopedFeed.load();
router.navigate("");
i.setFeedTitle("")
});
activatePlaceholders();
return this
},focusThing:function(){$("textarea.thing").autoResize({minHeight:21,extraSpace:0})
},checkSaveActive:function(){if($("textarea.thing").val()==""){$("button.save").addClass("inactive")
}else{$("button.save").removeClass("inactive")
}},resetForm:function(){$("textarea.thing").val("");
$("textarea.thing").focus();
$("textarea.thing").height(21);
this.checkSaveActive();
$(".suggest").empty().hide()
},initialValidation:function(){var h=$("textarea.thing").val();
$("textarea.thing").blur();
if(!h){return
}this.saveMoped(h)
},saveMoped:function(h){this.collection.create({thing:h},{created:true});
this.resetForm()
},});
var e=Backbone.View.extend({id:"account",tagName:"div",template:Handlebars.compile($("#account-template").html()),events:{'keyup input[name="oldpassword"]':"checkPassword","change .update":"detectAction"},render:function(){$(this.el).html(this.template(this.model.toJSON()));
return this
},callStart:function(){$("label.message").empty();
$(statusObject).removeClass("success error").stop().animate({opacity:1},200)
},callSuccess:function(){if(name=="oldpassword"){$(statusObject).addClass("success");
return
}if(name=="password"){$('label[for="oldpassword"].status').animate({opacity:0},2400);
$('input[name="password"]').val("")
}if(name=="createpassword"){$(statusObject).addClass("success").stop().css({opacity:1}).animate({opacity:0},2400,function(){$("div.password.twitter").fadeOut(600,function(){$("div.password.moped").fadeIn(600)
})
});
return
}$(statusObject).addClass("success").stop().css({opacity:1}).animate({opacity:0},4800)
},callError:function(h){$(statusObject).addClass("error").stop().css({opacity:1}).animate({opacity:0},4800);
if(window.messageObject&&h){$(messageObject).html(h)
}},resetField:function(){$(field).val(oldValue);
if(name=="password"){$('fieldset[name="changepassword"] input').val("").blur();
$(field).attr("disabled",true)
}},detectAction:function(l){if($(l.currentTarget).hasClass("update")){window.action="update"
}if($(l.currentTarget).is("input")){window.name=$(l.currentTarget).prop("name")
}if($(l.currentTarget).is("label")){window.name=$(l.currentTarget).prop("for")
}if($(l.currentTarget).is("input")){window.field=l.currentTarget
}else{window.field=$('input[name="'+name+'"]')
}window.statusObject=$('label[for="'+name+'"].status');
if($('label[for="'+name+'"].message').length){window.messageObject=$('label[for="'+name+'"].message')
}else{delete window.messageObject
}if($(l.currentTarget).is("label")){var j=!$(field).is(":checked");
$(field).attr("checked",j)
}if($(field).is('[type="checkbox"]')){window.newValue=$(field).is(":checked")
}else{window.oldValue=$(field).data("value");
window.newValue=$(field).val()
}var i=this.callStart;
var n=this.callSuccess;
var m=this.callError;
var s=this.resetField;
if($(field).val()==""){s();
return
}if(name=="email"){var o=$(field).val();
var r=/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
var h=r.test(o);
if(h==false){m(o+" is not a valid email address");
return
}}if(name=="createpassword"){if(newValue!=$('input[name="createpasswordcheck"]').val()){m("Passwords did not match");
return
}}var k;
if(name=="send_notifications"||name=="display_name"){var q=new UserProfile(this.model.get("profile"));
k=q
}else{k=this.model
}var p={};
if(name=="createpassword"){p.password=newValue
}else{p[name]=newValue
}i();
k.save(p,{success:function(){n();
if(name=="password"){s()
}},error:function(){if(name=="email"){var t=o+" is already in use"
}m(t);
s()
}})
},checkPassword:_.throttle(function(k){window.passwordCheck=false;
window.field=k.currentTarget;
window.name=$(k.currentTarget).prop("name");
window.statusObject=$('label[for="'+name+'"].status');
window.password=$(field).val();
var h=this.callStart;
var i=this.callSuccess;
var j=this.callError;
$.ajax({url:API_BASE_URL+"/api/v1/apikey/",type:"GET",headers:{"X-MOPED-EMAIL":userSession.get("email"),"X-MOPED-PASSWORD":password},beforeSend:function(){h()
},complete:function(){},error:function(n,l,m){window.passwordCheck=false;
j();
$('input[name="password"]').attr("disabled",true)
},success:function(m,n,l){window.passwordCheck=true;
i();
$('input[name="password"]').attr("disabled",false)
}})
},500),});
var a=Backbone.View.extend({tagName:"li",className:"cf",template:Handlebars.compile($("#person-template").html()),events:{},render:function(){$(this.el).html(this.template(this.model.toJSON()));
return this
}});
var g=Backbone.View.extend({template:Handlebars.compile($("#people-template").html()),className:"container page people cf",initialize:function(){Relationships.unbind();
Relationships.bind("add",this.addOne,this);
Relationships.bind("reset",this.reset,this);
Relationships.fetch()
},addOne:function(h){var i=new a({model:h});
this.$("#connections").append(i.render().el)
},reset:function(){$("#connections").empty();
Relationships.each(this.addOne)
},render:function(){$(this.el).html(this.template());
return this
},});
window.Router=Backbone.Router.extend({routes:{"":"home","tag/:tagname":"tag","user/:username":"user",account:"account",people:"people","moped/:mid":"moped","search/:text":"search"},home:function(){$(document).trigger("track_user",userSession.get("username"));
if($("textarea.thing").data("AutoResizer")){$("textarea.thing").data("AutoResizer").destroy()
}var i=new MopedList();
var h=new c({collection:i});
$("#app").html(h.render().el);
activatePlaceholders()
},tag:function(j){$(document).trigger("tag_route");
$("#loading-status").waypoint("destroy");
var i=new MopedList();
var h=new c({collection:i,tag:j});
$("#app").html(h.render().el)
},user:function(j){$(document).trigger("user_route");
$("#loading-status").waypoint("destroy");
var i=new MopedList();
var h=new c({collection:i,person:j});
$("#app").html(h.render().el)
},account:function(){new d();
var h=new User({id:userSession.get("id")});
h.fetch({success:function(k,j){var i=new e({model:k});
$("#app").html(i.render().el);
activatePlaceholders()
}})
},people:function(){new d();
var h=new g();
$("#app").html(h.render().el)
},moped:function(i){var h=new MopedList();
h.fetch({data:{id:i},success:function(l,k){var j=new c({collection:l,moped:i});
$("#app").html(j.render().el)
}})
},search:function(j){var i=new MopedList({search:j});
var h=new c({collection:i});
$("#app").html(h.render().el);
h.setFeedTitle(j,"search")
}})
});
var MopedApp=(function(){var a=function(d){var c=function(e){if(e.has("profile")&&e.get("profile").twitter){return e.get("profile").twitter.image_url
}else{return null
}};
return{name:d.get("username"),display_name:d.get("profile").display_name,image:c(d)}
};
var b=function(){var c="private-u-"+userSession.get("id"),d=pusher.subscribe(c);
d.bind("mention",function(f){var e=new Moped(f);
new_mopeds.push(e);
var g=owl.pluralize("moped",new_mopeds.length);
$("#new-moped-text").text(new_mopeds.length+" new "+g);
$("#show-new-mopeds").show();
$.faviconNotify("/img/favicon-alert.png");
$("title").text("("+new_mopeds.length+") Moped")
});
d.bind("notification",function(e){$(document).trigger("newNotification",e)
})
};
return{userAuthenticated:function(){if(!userSession.logged_in()){var d="/auth/";
if(window.location.hash.length>0){var c=window.location.pathname+window.location.hash;
d+=("?r="+encodeURIComponent(c))
}window.location=d;
return false
}return true
},load:function(){window.router=new Router();
Relationships.fetch({success:function(d,c){window.usernames=d.map(a)
}});
this.templates={userSuggestion:Handlebars.compile($("#user-suggestion-template").html()),tagSuggestion:Handlebars.compile($("#tag-suggestion-template").html())};
if(pusher){b()
}Backbone.history.start()
}}
})();
(function(a){a.fn.autocomplete=function(d){d=a.extend({},{container:null,getSuggestions:function(){return[]
}},d);
KEY={UNKNOWN:0,SHIFT:16,CTRL:17,ALT:18,LEFT:37,UP:38,RIGHT:39,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,COMMA:188,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8,SPACE:32,HASH:35,AT:64};
var e=function(j){var i=a(j.currentTarget),h=a(d.container);
if(i.hasClass("selected")){return
}h.find(".selected").removeClass("selected");
i.addClass("selected")
};
var b=function(l,k){var j=k.data("autocomplete"),h=a(d.container).find(".selected").data("value"),i=k.getSelection();
k.focus();
k.setSelection(j.start+1,i.end);
k.replaceSelection(h+" ");
k.removeData("autocomplete");
a(d.container).empty().hide()
};
var c=function(o){var n=a(o.currentTarget),m=n.data("autocomplete");
if(!_.isUndefined(m)){switch(o.which){case KEY.DOWN:var l=a(d.container).find(".selected"),h=l.next();
o.preventDefault();
o.stopPropagation();
if(h.length>0){l.removeClass("selected");
h.addClass("selected")
}return false;
case KEY.UP:var l=a(d.container).find(".selected"),j=l.prev();
o.preventDefault();
o.stopPropagation();
if(j.length>0){l.removeClass("selected");
j.addClass("selected")
}return false;
case KEY.TAB:case KEY.RETURN:var i=a(d.container).find(".selected").data("value"),k=n.getSelection();
if(i==null||i.length<=0){n.removeData("autocomplete");
if(o.which==KEY.RETURN){o.preventDefault();
o.stopPropagation();
n.trigger("autocomplete.done");
return false
}return true
}o.preventDefault();
o.stopPropagation();
n.focus();
n.setSelection(m.start+1,k.end);
if(n.val().substr(k.end,1)===" "){n.replaceSelection(i)
}else{n.replaceSelection(i+" ")
}return false
}}return true
};
var g=function(j){var i=a(j.currentTarget),h=i.data("autocomplete");
if(j.which===KEY.AT||j.which===KEY.HASH){var l=i.getSelection().start,k=i.val();
if(l==0||_.include([" ","\n"],k[l-1])){i.data("autocomplete",{type:j.which,start:l,chr:j.which})
}}else{if(j.which==KEY.RETURN&&_.isUndefined(h)){if(!j.shiftKey){j.preventDefault();
i.trigger("autocomplete.done");
return
}}}if(!_.isUndefined(h)){h.chr=j.which;
i.data("autocomplete",h)
}};
var f=function(m){var n=a(m.currentTarget),j=n.data("autocomplete"),o=n.getSelection(),h=n.val();
if(!j){return
}h=h.slice(j.start,o.start);
if(h.length<=0){j=undefined
}else{if(!_.isUndefined(j)){switch(m.keyCode){case KEY.BACKSPACE:if(m.currentTarget.selectionStart<=j.start){j=undefined
}break;
case KEY.ESC:case KEY.TAB:case KEY.RETURN:j=undefined;
break;
case KEY.UP:case KEY.DOWN:return;
default:if(m.currentTarget.selectionStart-1<j.start){j=undefined;
break
}if(j.chr===KEY.AT||j.chr==KEY.HASH){break
}if(String.fromCharCode(j.chr).match(/\W/)){n.removeData("autocomplete");
j=undefined
}}}}a(d.container).empty().hide();
if(_.isUndefined(j)){n.removeData("autocomplete");
return
}h=h.substr(1);
var p=a(d.container),l=d.getSuggestions(h,j.type),i=_.reject(l,function(q){return q.score===0
});
if(i.length===0){return
}i=_.sortBy(i,function(q){return -(q.score)
});
if(i.length>10){i=_.first(i,10)
}var k=function(t,r){var q;
t.cssclass=r?"selected":"";
if(j.type===KEY.AT){q=MopedApp.templates.userSuggestion(t)
}else{if(j.type===KEY.HASH){q=MopedApp.templates.tagSuggestion(t)
}}p.append(q)
};
k(_.first(i),true);
a.each(_.rest(i),function(){k(this)
});
a(d.container).find("li").mouseover(e).click(function(q){return b(q,n)
});
p.show()
};
return this.each(function(){a(this).keydown(c).keypress(g).keyup(f)
})
}
})(jQuery);
$(document).ready(function(){var b=function(g){mpq.track("View: "+g)
};
var a=function(h,g){mpq.track("Click: "+h+" / "+g)
};
var e=function(h,g){mpq.track("Key: "+h+" / "+g)
};
var d=function(g){mpq.name_tag(g)
};
var f=function(g){mpq.track("Search: "+g)
};
$(document).bind("user_route",function(h,g){b("User")
});
$(document).bind("tag_route",function(g,h){b("Tag")
});
$(document).bind("create_return",function(){e("Create","Enter")
});
$(document).bind("track_user",function(g,h){d(h)
});
$(document).bind("track_search",function(h,g){f(g)
});
var c=function(g){console.log("trackUserFilter",this,arguments)
};
$("#app").on("click","#names a.filter",function(){a("Filter","User");
b("User")
});
$("#app").on("click","#tags a.filter",function(){a("Filter","Tag");
b("Tag")
});
$("#app").on("click",".moped div.creator a",function(g){a("Feed","Creator")
});
$("#app").on("click",".moped .thing a.filter.user",function(g){a("Feed","User")
});
$("#app").on("click",".moped .thing a.filter.tag",function(g){a("Feed","Tag")
});
$("#app").on("click",".moped .remove",function(g){a("Feed","Remove")
});
$(".logo.home").on("click",function(g){a("Header","Logo")
});
$(".menu .home").on("click",function(g){a("Header","Home")
});
$("#app").on("click","form.new .save",function(g){a("Create","Post")
})
});