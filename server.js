//	Customization
//var appPort = 8080;
var appPort = process.env.PORT || 8080;
// Librairies

var express = require('express'),
    app = express();
var http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);


var jade = require('jade');
// var io = require('socket.io').listen(app);
var pseudoArray = []; //block the admin username (you can disable it)
var socketchannels = [];
var chanels = [];
// Views Options

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {
    layout: false
})

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

// Render and send the main page

app.get('/', function (req, res) {
    // res.render('home.jade');
});
server.listen(appPort);
// app.listen(appPort);
console.log("Server listening on port " + appPort);


// Handle the socket.io connections


var fiveletterwords = ["aahed", "aalii", "aargh", "abaca", "abaci", "aback", "abaft", "abaka", "abamp", "abase", "abash", "abate", "abbas", "abbes", "abbey", "abbot", "abeam", "abele", "abets", "abhor", "abide", "abled", "abler", "ables", "abmho", "abode", "abohm", "aboil", "aboma", "aboon", "abort", "about", "above", "abris", "abuse", "abuts", "abuzz", "abyes", "abysm", "abyss", "acari", "acerb", "aceta", "ached", "aches", "achoo", "acids", "acidy", "acing", "acini", "ackee", "acmes", "acmic", "acned", "acnes", "acock", "acold", "acorn", "acred", "acres", "acrid", "acted", "actin", "actor", "acute", "acyls", "adage", "adapt", "addax", "added", "adder", "addle", "adeem", "adept", "adieu", "adios", "adits", "adman", "admen", "admit", "admix", "adobe", "adobo", "adopt", "adore", "adorn", "adown", "adoze", "adult", "adunc", "adust", "adyta", "adzed", "adzes", "aecia", "aedes", "aegis", "aeons", "aerie", "afars", "affix", "afire", "afoot", "afore", "afoul", "afrit", "after", "again", "agama", "agape", "agars", "agate", "agave", "agaze", "agene", "agent", "agers", "agger", "aggie", "aggro", "aghas", "agile", "aging", "agios", "agism", "agist", "aglee", "aglet", "agley", "aglow", "agmas", "agone", "agons", "agony", "agora", "agree", "agria", "agues", "ahead", "ahing", "ahold", "ahull", "aided", "aider", "aides", "ailed", "aimed", "aimer", "aioli", "aired", "airer", "airns", "airth", "airts", "aisle", "aitch", "aiver", "ajiva", "ajuga", "akees", "akela", "akene", "alack", "alamo", "aland", "alane", "alang", "alans", "alant", "alarm", "alary", "alate", "albas", "album", "alcid", "alder", "aldol", "alecs", "alefs", "aleph", "alert", "alfas", "algae", "algal", "algas", "algid", "algin", "algor", "algum", "alias", "alibi", "alien", "alifs", "align", "alike", "aline", "alist", "alive", "aliya", "alkyd", "alkyl", "allay", "allee", "alley", "allod", "allot", "allow", "alloy", "allyl", "almah", "almas", "almeh", "almes", "almud", "almug", "aloes", "aloft", "aloha", "aloin", "alone", "along", "aloof", "aloud", "alpha", "altar", "alter", "altho", "altos", "alula", "alums", "alway", "amahs", "amain", "amass", "amaze", "amber", "ambit", "amble", "ambos", "ambry", "ameba", "ameer", "amend", "amens", "ament", "amias", "amice", "amici", "amide", "amido", "amids", "amies", "amiga", "amigo", "amine", "amino", "amins", "amirs", "amiss", "amity", "ammos", "amnia", "amnic", "amoks", "amole", "among", "amort", "amour", "ample", "amply", "ampul", "amuck", "amuse", "amyls", "ancon", "anear", "anele", "anent", "angas", "angel", "anger", "angle", "angry", "angst", "anile", "anils", "anima", "anime", "animi", "anion", "anise", "ankhs", "ankle", "ankus", "anlas", "annal", "annas", "annex", "annoy", "annul", "anoas", "anode", "anole", "anomy", "ansae", "antae", "antas", "anted", "antes", "antic", "antis", "antra", "antre", "antsy", "anvil", "aorta", "apace", "apart", "apeak", "apeek", "apers", "apery", "aphid", "aphis", "apian", "aping", "apish", "apnea", "apods", "aport", "appal", "appel", "apple", "apply", "apres", "apron", "apses", "apsis", "apter", "aptly", "aquae", "aquas", "araks", "arame", "arbor", "arced", "arcus", "ardeb", "ardor", "areae", "areal", "areas", "areca", "areic", "arena", "arete", "argal", "argil", "argle", "argol", "argon", "argot", "argue", "argus", "arhat", "arias", "ariel", "arils", "arise", "arles", "armed", "armer", "armet", "armor", "aroid", "aroma", "arose", "arpen", "arras", "array", "arris", "arrow", "arses", "arsis", "arson", "artal", "artel", "artsy", "arums", "arval", "arvos", "aryls", "asana", "ascot", "ascus", "asdic", "ashed", "ashen", "ashes", "aside", "asked", "asker", "askew", "askoi", "askos", "aspen", "asper", "aspic", "aspis", "assai", "assay", "asses", "asset", "aster", "astir", "asyla", "ataps", "ataxy", "atilt", "atlas", "atman", "atmas", "atoll", "atoms", "atomy", "atone", "atony", "atopy", "atria", "atrip", "attar", "attic", "audad", "audio", "audit", "auger", "aught", "augur", "aulic", "aunts", "aunty", "aurae", "aural", "aurar", "auras", "aurei", "aures", "auric", "auris", "aurum", "autos", "auxin", "avail", "avant", "avast", "avens", "avers", "avert", "avgas", "avian", "avion", "aviso", "avoid", "avows", "await", "awake", "award", "aware", "awash", "awful", "awing", "awned", "awoke", "awols", "axels", "axial", "axile", "axils", "axing", "axiom", "axion", "axite", "axled", "axles", "axman", "axmen", "axone", "axons", "ayahs", "ayins", "azans", "azide", "azido", "azine", "azlon", "azoic", "azole", "azons", "azote", "azoth", "azure", "baaed", "baals", "babas", "babel", "babes", "babka", "baboo", "babul", "babus", "bacca", "backs", "bacon", "baddy", "badge", "badly", "baffs", "baffy", "bagel", "baggy", "bahts", "bails", "bairn", "baith", "baits", "baiza", "baize", "baked", "baker", "bakes", "balas", "balds", "baldy", "baled", "baler", "bales", "balks", "balky", "balls", "bally", "balms", "balmy", "balsa", "banal", "banco", "bands", "bandy", "baned", "banes", "bangs", "banjo", "banks", "banns", "banty", "barbe", "barbs", "barde", "bards", "bared", "barer", "bares", "barfs", "barge", "baric", "barks", "barky", "barms", "barmy", "barns", "barny", "baron", "barre", "barye", "basal", "based", "baser", "bases", "basic", "basil", "basin", "basis", "basks", "bassi", "basso", "bassy", "baste", "basts", "batch", "bated", "bates", "bathe", "baths", "batik", "baton", "batts", "battu", "batty", "bauds", "baulk", "bawds", "bawdy", "bawls", "bawty", "bayed", "bayou", "bazar", "bazoo", "beach", "beads", "beady", "beaks", "beaky", "beams", "beamy", "beano", "beans", "beard", "bears", "beast", "beats", "beaus", "beaut", "beaux", "bebop", "becap", "becks", "bedel", "bedew", "bedim", "beech", "beefs", "beefy", "beeps", "beers", "beery", "beets", "befit", "befog", "began", "begat", "beget", "begin", "begot", "begum", "begun", "beige", "beigy", "being", "belay", "belch", "belga", "belie", "belle", "bells", "belly", "below", "belts", "bemas", "bemix", "bench", "bends", "bendy", "benes", "benne", "benni", "benny", "bento", "bents", "beret", "bergs", "berme", "berms", "berry", "berth", "beryl", "beset", "besom", "besot", "bests", "betas", "betel", "beths", "beton", "betta", "bevel", "bevor", "bewig", "bezel", "bezil", "bhang", "bhoot", "bhuts", "biali", "bialy", "bibbs", "bible", "bicep", "bices", "biddy", "bided", "bider", "bides", "bidet", "bield", "biers", "biffs", "biffy", "bifid", "bight", "bigly", "bigot", "bijou", "biked", "biker", "bikes", "bikie", "bilbo", "biles", "bilge", "bilgy", "bilks", "bills", "billy", "bimah", "bimas", "bimbo", "binal", "bindi", "binds", "bines", "binge", "bingo", "binit", "bints", "biome", "biont", "biota", "biped", "bipod", "birch", "birds", "birks", "birle", "birls", "birrs", "birse", "birth", "bises", "bisks", "bison", "bitch", "biter", "bites", "bitsy", "bitts", "bitty", "bizes", "blabs", "black", "blade", "blahs", "blain", "blame", "blams", "bland", "blank", "blare", "blase", "blast", "blate", "blats", "blawn", "blaws", "blaze", "bleak", "blear", "bleat", "blebs", "bleed", "bleep", "blend", "blent", "bless", "blest", "blets", "blimp", "blimy", "blind", "blini", "blink", "blips", "bliss", "blite", "blitz", "bloat", "blobs", "block", "blocs", "blogs", "bloke", "blond", "blood", "bloom", "bloop", "blots", "blown", "blows", "blowy", "blubs", "blued", "bluer", "blues", "bluet", "bluey", "bluff", "blume", "blunt", "blurb", "blurs", "blurt", "blush", "blype", "board", "boars", "boart", "boast", "boats", "bobby", "bocce", "bocci", "boche", "bocks", "boded", "bodes", "boffo", "boffs", "bogan", "bogey", "boggy", "bogie", "bogle", "bogus", "bohea", "boils", "boing", "boite", "bolar", "bolas", "bolds", "boles", "bolls", "bolos", "bolts", "bolus", "bombe", "bombs", "bonds", "boned", "boner", "bones", "boney", "bongo", "bongs", "bonks", "bonne", "bonny", "bonus", "bonze", "boobs", "booby", "booed", "boogy", "books", "booms", "boomy", "boons", "boors", "boost", "booth", "boots", "booty", "booze", "boozy", "boral", "boras", "borax", "bored", "borer", "bores", "boric", "borne", "boron", "borts", "borty", "bortz", "bosks", "bosky", "bosom", "boson", "bossy", "bosun", "botas", "botch", "botel", "bothy", "botts", "bough", "boule", "bound", "bourg", "bourn", "bouse", "bousy", "bouts", "bovid", "bowed", "bowel", "bower", "bowls", "bowse", "boxed", "boxer", "boxes", "boyar", "boyla", "boyos", "bozos", "brace", "brach", "bract", "brads", "braes", "brags", "braid", "brail", "brain", "brake", "braky", "brand", "brank", "brans", "brant", "brash", "brass", "brats", "brava", "brave", "bravi", "bravo", "brawl", "brawn", "braws", "braxy", "brays", "braza", "braze", "bread", "break", "bream", "brede", "breed", "brees", "brens", "brent", "breve", "brews", "briar", "bribe", "brick", "bride", "brief", "brier", "bries", "brigs", "brill", "brims", "brine", "bring", "brink", "brins", "briny", "brios", "brisk", "briss", "brits", "britt", "broad", "brock", "broil", "broke", "brome", "bromo", "bronc", "brood", "brook", "broom", "broos", "brose", "brosy", "broth", "brown", "brows", "brugh", "bruin", "bruit", "brume", "brunt", "brush", "brusk", "brute", "bubal", "bubby", "bucko", "bucks", "buddy", "budge", "buffi", "buffo", "buffs", "buffy", "buggy", "bugle", "buhls", "buhrs", "build", "built", "bulbs", "bulge", "bulgy", "bulks", "bulky", "bulla", "bulls", "bully", "bumfs", "bumph", "bumps", "bumpy", "bunch", "bunco", "bunds", "bundt", "bungs", "bunko", "bunks", "bunns", "bunny", "bunts", "bunya", "buoys", "buran", "buras", "burbs", "burds", "buret", "burgh", "burgs", "burin", "burke", "burls", "burly", "burns", "burnt", "burps", "burqa", "burro", "burrs", "burry", "bursa", "burse", "burst", "busby", "bused", "buses", "bushy", "busks", "busts", "busty", "butch", "buteo", "butle", "butte", "butts", "butty", "butut", "butyl", "buxom", "buyer", "bwana", "bylaw", "byres", "byrls", "byssi", "bytes", "byway", "cabal", "cabby", "caber", "cabin", "cable", "cabob", "cacao", "cacas", "cache", "cacti", "caddy", "cades", "cadet", "cadge", "cadgy", "cadis", "cadre", "caeca", "cafes", "caffs", "caged", "cager", "cages", "cagey", "cahow", "caids", "cains", "caird", "cairn", "cajon", "caked", "cakes", "cakey", "calfs", "calif", "calix", "calks", "calla", "calls", "calms", "calve", "calyx", "camas", "camel", "cameo", "cames", "campi", "campo", "camps", "campy", "canal", "candy", "caned", "caner", "canes", "canid", "canna", "canny", "canoe", "canon", "canso", "canst", "canto", "cants", "canty", "caped", "caper", "capes", "caphs", "capiz", "capon", "capos", "caput", "carat", "carbo", "carbs", "cards", "cared", "carer", "cares", "caret", "carex", "cargo", "carks", "carle", "carls", "carns", "carny", "carob", "carol", "carom", "carpi", "carps", "carrs", "carry", "carse", "carte", "carts", "carve", "casas", "cased", "cases", "casks", "casky", "caste", "casts", "casus", "catch", "cater", "cates", "catty", "cauld", "caulk", "cauls", "cause", "caved", "caver", "caves", "cavie", "cavil", "cawed", "cease", "cebid", "cecal", "cecum", "cedar", "ceded", "ceder", "cedes", "cedis", "ceiba", "ceils", "celeb", "cella", "celli", "cello", "cells", "celom", "celts", "cense", "cento", "cents", "ceorl", "cepes", "cerci", "cered", "ceres", "ceria", "ceric", "ceros", "cesta", "cesti", "cetes", "chads", "chafe", "chaff", "chain", "chair", "chalk", "champ", "chams", "chang", "chant", "chaos", "chape", "chaps", "chapt", "chard", "chare", "chark", "charm", "charr", "chars", "chart", "chary", "chase", "chasm", "chats", "chaws", "chays", "cheap", "cheat", "check", "cheek", "cheep", "cheer", "chefs", "chela", "chemo", "chert", "chess", "chest", "cheth", "chevy", "chews", "chewy", "chiao", "chias", "chick", "chico", "chics", "chide", "chief", "chiel", "child", "chile", "chili", "chill", "chimb", "chime", "chimp", "china", "chine", "chino", "chins", "chips", "chirk", "chirm", "chiro", "chirp", "chirr", "chits", "chive", "chivy", "chock", "choir", "choke", "choky", "cholo", "chomp", "chook", "chops", "chord", "chore", "chose", "chott", "chows", "chubs", "chuck", "chufa", "chuff", "chugs", "chump", "chums", "chunk", "churl", "churn", "churr", "chute", "chyle", "chyme", "cibol", "cider", "cigar", "cilia", "cimex", "cinch", "cines", "cions", "circa", "cires", "cirri", "cisco", "cissy", "cists", "cited", "citer", "cites", "civet", "civic", "civie", "civil", "civvy", "clach", "clack", "clade", "clads", "clags", "claim", "clamp", "clams", "clang", "clank", "clans", "claps", "clapt", "claro", "clary", "clash", "clasp", "class", "clast", "clave", "clavi", "claws", "clays", "clean", "clear", "cleat", "cleek", "clefs", "cleft", "clepe", "clept", "clerk", "clews", "click", "cliff", "clift", "climb", "clime", "cline", "cling", "clink", "clips", "clipt", "cloak", "clock", "clods", "clogs", "clomb", "clomp", "clone", "clonk", "clons", "cloot", "clops", "close", "cloth", "clots", "cloud", "clour", "clout", "clove", "clown", "cloys", "cloze", "clubs", "cluck", "clued", "clues", "clump", "clung", "clunk", "cnida", "coach", "coact", "coala", "coals", "coaly", "coapt", "coast", "coati", "coats", "cobbs", "cobby", "cobia", "coble", "cobra", "cocas", "cocci", "cocks", "cocky", "cocoa", "cocos", "codas", "codec", "coded", "coden", "coder", "codes", "codex", "codon", "coeds", "coffs", "cogon", "cohog", "cohos", "coifs", "coign", "coils", "coins", "coirs", "coked", "cokes", "colas", "colds", "coled", "coles", "colic", "colin", "colly", "colog", "colon", "color", "colts", "colza", "comae", "comal", "comas", "combe", "combo", "combs", "comer", "comes", "comet", "comfy", "comic", "comix", "comma", "commy", "compo", "comps", "compt", "comte", "conch", "condo", "coned", "cones", "coney", "conga", "conge", "congo", "conic", "conin", "conks", "conky", "conns", "conte", "conto", "conus", "cooch", "cooed", "cooee", "cooer", "cooey", "coofs", "cooks", "cooky", "cools", "cooly", "coomb", "coons", "coops", "coopt", "coots", "copal", "coped", "copen", "coper", "copes", "copra", "copse", "coral", "corby", "cords", "cored", "corer", "cores", "corgi", "coria", "corks", "corky", "corms", "corns", "cornu", "corny", "corps", "corse", "cosec", "coses", "coset", "cosey", "cosie", "costa", "costs", "cotan", "coted", "cotes", "cotta", "couch", "coude", "cough", "could", "count", "coupe", "coups", "court", "couth", "coved", "coven", "cover", "coves", "covet", "covey", "covin", "cowed", "cower", "cowls", "cowry", "coxae", "coxal", "coxed", "coxes", "coyed", "coyer", "coyly", "coypu", "cozen", "cozes", "cozey", "cozie", "craal", "crabs", "crack", "craft", "crags", "crake", "cramp", "crams", "crane", "crank", "crape", "craps", "crash", "crass", "crate", "crave", "crawl", "craws", "craze", "crazy", "creak", "cream", "credo", "creed", "creek", "creel", "creep", "creme", "crepe", "crept", "crepy", "cress", "crest", "crews", "cribs", "crick", "cried", "crier", "cries", "crime", "crimp", "cripe", "crisp", "croak", "croci", "crock", "crocs", "croft", "crone", "crony", "crook", "croon", "crops", "crore", "cross", "croup", "crowd", "crown", "crows", "croze", "cruck", "crude", "cruds", "cruel", "cruet", "crumb", "crump", "cruor", "crura", "cruse", "crush", "crust", "crwth", "crypt", "cubby", "cubeb", "cubed", "cuber", "cubes", "cubic", "cubit", "cuddy", "cuffs", "cuifs", "cuing", "cuish", "cukes", "culch", "culet", "culex", "culls", "cully", "culms", "culpa", "culti", "cults", "cumin", "cupel", "cupid", "cuppa", "cuppy", "curbs", "curch", "curds", "curdy", "cured", "curer", "cures", "curet", "curfs", "curia", "curie", "curio", "curls", "curly", "curns", "currs", "curry", "curse", "curst", "curve", "curvy", "cusec", "cushy", "cusks", "cusps", "cusso", "cutch", "cuter", "cutes", "cutey", "cutie", "cutin", "cutis", "cutty", "cutup", "cyano", "cyans", "cyber", "cycad", "cycas", "cycle", "cyclo", "cyder", "cylix", "cymae", "cymar", "cymas", "cymes", "cymol", "cynic", "cysts", "cyton", "czars", "daces", "dacha", "dadas", "daddy", "dados", "daffs", "daffy", "dagga", "dagos", "dahls", "daily", "dairy", "daisy", "dales", "dally", "daman", "damar", "dames", "damns", "damps", "dance", "dandy", "dangs", "danio", "darbs", "dared", "darer", "dares", "daric", "darks", "darky", "darns", "darts", "dashi", "dashy", "dated", "dater", "dates", "datos", "datto", "datum", "daube", "daubs", "dauby", "daunt", "dauts", "daven", "davit", "dawed", "dawen", "dawks", "dawns", "dawts", "dazed", "dazes", "deads", "deair", "deals", "dealt", "deans", "dears", "deary", "deash", "death", "deave", "debar", "debit", "debts", "debug", "debut", "debye", "decaf", "decal", "decay", "decks", "decor", "decos", "decoy", "decry", "dedal", "deeds", "deedy", "deems", "deeps", "deers", "deets", "defat", "defer", "defis", "defog", "degas", "degum", "deice", "deify", "deign", "deils", "deism", "deist", "deity", "deked", "dekes", "dekko", "delay", "deled", "deles", "delfs", "delft", "delis", "dells", "delly", "delta", "delve", "demes", "demit", "demob", "demon", "demos", "demur", "denes", "denim", "dense", "dents", "deoxy", "depot", "depth", "derat", "deray", "derby", "derma", "derms", "derry", "desex", "desks", "deter", "detox", "deuce", "devas", "devel", "devil", "devon", "dewan", "dewar", "dewax", "dewed", "dexes", "dexie", "dhaks", "dhals", "dhobi", "dhole", "dhoti", "dhows", "dhuti", "dials", "diary", "diazo", "diced", "dicer", "dices", "dicey", "dicks", "dicky", "dicot", "dicta", "dicty", "didie", "didos", "didst", "diene", "diets", "dight", "digit", "diked", "diker", "dikes", "dikey", "dildo", "dills", "dilly", "dimer", "dimes", "dimly", "dinar", "dined", "diner", "dines", "dinge", "dingo", "dings", "dingy", "dinks", "dinky", "dinos", "dints", "diode", "diols", "dippy", "dipso", "direr", "dirge", "dirks", "dirls", "dirts", "dirty", "disci", "disco", "discs", "dishy", "disks", "disme", "ditas", "ditch", "dites", "ditsy", "ditto", "ditty", "ditzy", "divan", "divas", "dived", "diver", "dives", "divot", "divvy", "diwan", "dixit", "dizen", "dizzy", "djinn", "djins", "doats", "dobby", "dobie", "dobla", "dobra", "docks", "dodge", "dodgy", "dodos", "doers", "doest", "doeth", "doffs", "doges", "dogey", "doggo", "doggy", "dogie", "dogma", "doily", "doing", "doits", "dojos", "dolce", "dolci", "doled", "doles", "dolls", "dolly", "dolma", "dolor", "dolts", "domal", "domed", "domes", "domic", "donas", "donee", "donga", "dongs", "donna", "donne", "donor", "donsy", "donut", "dooly", "dooms", "doomy", "doors", "doozy", "dopas", "doped", "doper", "dopes", "dopey", "dorks", "dorky", "dorms", "dormy", "dorps", "dorrs", "dorsa", "dorty", "dosed", "doser", "doses", "dotal", "doted", "doter", "dotes", "dotty", "doubt", "douce", "dough", "doula", "douma", "doums", "doura", "douse", "doven", "doves", "dowdy", "dowed", "dowel", "dower", "dowie", "downs", "downy", "dowry", "dowse", "doxie", "doyen", "doyly", "dozed", "dozen", "dozer", "dozes", "drabs", "draff", "draft", "drags", "drail", "drain", "drake", "drama", "drams", "drank", "drape", "drats", "drave", "drawl", "drawn", "draws", "drays", "dread", "dream", "drear", "dreck", "dreed", "drees", "dregs", "dreks", "dress", "drest", "dribs", "dried", "drier", "dries", "drift", "drill", "drily", "drink", "drips", "dript", "drive", "droid", "droit", "droll", "drone", "drool", "droop", "drops", "dropt", "dross", "drouk", "drove", "drown", "drubs", "drugs", "druid", "drums", "drunk", "drupe", "druse", "dryad", "dryer", "dryly", "duads", "duals", "ducal", "ducat", "duces", "duchy", "ducks", "ducky", "ducts", "duddy", "duded", "dudes", "duels", "duets", "duffs", "dufus", "duits", "duked", "dukes", "dulia", "dulls", "dully", "dulse", "dumas", "dumbs", "dumka", "dumky", "dummy", "dumps", "dumpy", "dunam", "dunce", "dunch", "dunes", "dungs", "dungy", "dunks", "dunts", "duomi", "duomo", "duped", "duper", "dupes", "duple", "dural", "duras", "dured", "dures", "durns", "duroc", "duros", "durra", "durrs", "durst", "durum", "dusks", "dusky", "dusts", "dusty", "dutch", "duvet", "dwarf", "dweeb", "dwell", "dwelt", "dwine", "dyads", "dyers", "dying", "dyked", "dykes", "dykey", "dynel", "dynes", "eager", "eagle", "eagre", "eared", "earls", "early", "earns", "earth", "eased", "easel", "eases", "easts", "eaten", "eater", "eaved", "eaves", "ebbed", "ebbet", "ebons", "ebony", "ebook", "eched", "eches", "echos", "eclat", "ecrus", "edema", "edged", "edger", "edges", "edict", "edify", "edile", "edits", "educe", "educt", "eerie", "egads", "egers", "egest", "eggar", "egged", "egger", "egret", "eider", "eidos", "eight", "eikon", "eject", "eking", "elain", "eland", "elans", "elate", "elbow", "elder", "elect", "elegy", "elemi", "elfin", "elide", "elint", "elite", "eloin", "elope", "elude", "elute", "elver", "elves", "email", "embar", "embay", "embed", "ember", "embow", "emcee", "emeer", "emend", "emery", "emeus", "emirs", "emits", "emmer", "emmet", "emote", "empty", "emyde", "emyds", "enact", "enate", "ended", "ender", "endow", "endue", "enema", "enemy", "enjoy", "ennui", "enoki", "enols", "enorm", "enows", "enrol", "ensky", "ensue", "enter", "entia", "entry", "enure", "envoi", "envoy", "enzym", "eosin", "epact", "epees", "ephah", "ephas", "ephod", "ephor", "epics", "epoch", "epode", "epoxy", "equal", "equid", "equip", "erase", "erect", "ergot", "erica", "ernes", "erode", "erose", "erred", "error", "erses", "eruct", "erugo", "erupt", "ervil", "escar", "escot", "eskar", "esker", "essay", "esses", "ester", "estop", "etape", "ether", "ethic", "ethos", "ethyl", "etnas", "etude", "etuis", "etwee", "etyma", "euros", "evade", "evens", "event", "evert", "every", "evict", "evils", "evite", "evoke", "ewers", "exact", "exalt", "exams", "excel", "execs", "exert", "exile", "exine", "exing", "exist", "exits", "exons", "expat", "expel", "expos", "extol", "extra", "exude", "exult", "exurb", "eyers", "eying", "eyras", "eyres", "eyrie", "eyrir", "fable", "faced", "facer", "faces", "facet", "facia", "facts", "faddy", "faded", "fader", "fades", "fadge", "fados", "faena", "faery", "fails", "faint", "fairs", "fairy", "faith", "faked", "faker", "fakes", "fakey", "fakir", "falls", "false", "famed", "fames", "fancy", "fanes", "fanga", "fangs", "fanny", "fanon", "fanos", "fanum", "faqir", "farad", "farce", "farci", "farcy", "fards", "fared", "farer", "fares", "farle", "farls", "farms", "faros", "farts", "fasts", "fatal", "fated", "fates", "fatly", "fatso", "fatty", "fatwa", "faugh", "fauld", "fault", "fauna", "fauns", "fauve", "favas", "faves", "favor", "favus", "fawns", "fawny", "faxed", "faxes", "fayed", "fazed", "fazes", "fears", "fease", "feast", "feats", "feaze", "fecal", "feces", "fecks", "feeds", "feels", "feeze", "feign", "feint", "feist", "felid", "fella", "fells", "felly", "felon", "felts", "femes", "femme", "femur", "fence", "fends", "fenny", "feods", "feoff", "feral", "feres", "feria", "ferly", "fermi", "ferns", "ferny", "ferry", "fesse", "fetal", "fetas", "fetch", "feted", "fetes", "fetid", "fetor", "fetus", "feuar", "feuds", "feued", "fever", "fewer", "feyer", "feyly", "fezes", "fiars", "fiats", "fiber", "fibre", "fices", "fiche", "fichu", "ficin", "ficus", "fidge", "fidos", "fiefs", "field", "fiend", "fiery", "fifed", "fifer", "fifes", "fifth", "fifty", "fight", "filar", "filch", "filed", "filer", "files", "filet", "fille", "fillo", "fills", "filly", "films", "filmy", "filos", "filth", "filum", "final", "finch", "finds", "fined", "finer", "fines", "finis", "finks", "finny", "finos", "fiord", "fique", "fired", "firer", "fires", "firms", "firns", "firry", "first", "firth", "fiscs", "fishy", "fists", "fitch", "fitly", "fiver", "fives", "fixed", "fixer", "fixes", "fixit", "fizzy", "fjeld", "fjord", "flabs", "flack", "flags", "flail", "flair", "flake", "flaky", "flame", "flams", "flamy", "flank", "flans", "flaps", "flare", "flash", "flask", "flats", "flaws", "flawy", "flaxy", "flays", "fleam", "fleas", "fleck", "fleer", "flees", "fleet", "flesh", "flews", "fleys", "flick", "flics", "flied", "flier", "flies", "fling", "flint", "flips", "flirt", "flite", "flits", "float", "flock", "flocs", "floes", "flogs", "flong", "flood", "floor", "flops", "flora", "floss", "flota", "flour", "flout", "flown", "flows", "flubs", "flued", "flues", "fluff", "fluid", "fluke", "fluky", "flume", "flump", "flung", "flunk", "fluor", "flush", "flute", "fluty", "fluyt", "flyby", "flyer", "flyte", "foals", "foams", "foamy", "focal", "focus", "foehn", "fogey", "foggy", "fogie", "fohns", "foils", "foins", "foist", "folds", "foley", "folia", "folic", "folio", "folks", "folky", "folly", "fonds", "fondu", "fonts", "foods", "fools", "foots", "footy", "foram", "foray", "forbs", "forby", "force", "fordo", "fords", "fores", "forge", "forgo", "forks", "forky", "forme", "forms", "forte", "forth", "forts", "forty", "forum", "fossa", "fosse", "fouls", "found", "fount", "fours", "fovea", "fowls", "foxed", "foxes", "foyer", "frags", "frail", "frame", "franc", "frank", "fraps", "frass", "frats", "fraud", "frays", "freak", "freed", "freer", "frees", "fremd", "frena", "frere", "fresh", "frets", "friar", "fried", "frier", "fries", "frigs", "frill", "frise", "frisk", "frith", "frits", "fritt", "fritz", "frizz", "frock", "froes", "frogs", "frond", "frons", "front", "frore", "frosh", "frost", "froth", "frown", "frows", "froze", "frugs", "fruit", "frump", "fryer", "fubsy", "fucus", "fudge", "fuels", "fugal", "fuggy", "fugio", "fugle", "fugue", "fugus", "fujis", "fulls", "fully", "fumed", "fumer", "fumes", "fumet", "fundi", "funds", "fungi", "fungo", "funks", "funky", "funny", "furan", "furls", "furor", "furry", "furze", "furzy", "fused", "fusee", "fusel", "fuses", "fusil", "fussy", "fusty", "futon", "fuzed", "fuzee", "fuzes", "fuzil", "fuzzy", "fyces", "fykes", "fytte", "gabby", "gable", "gaddi", "gadid", "gadis", "gaffe", "gaffs", "gaged", "gager", "gages", "gaily", "gains", "gaits", "galah", "galas", "galax", "galea", "gales", "galls", "gally", "galop", "gamas", "gamay", "gamba", "gambe", "gambs", "gamed", "gamer", "games", "gamey", "gamic", "gamin", "gamma", "gammy", "gamps", "gamut", "ganef", "ganev", "gangs", "ganja", "ganof", "gaols", "gaped", "gaper", "gapes", "gappy", "garbs", "garni", "garth", "gases", "gasps", "gassy", "gasts", "gated", "gates", "gator", "gauds", "gaudy", "gauge", "gault", "gaums", "gaunt", "gaurs", "gauss", "gauze", "gauzy", "gavel", "gavot", "gawks", "gawky", "gawps", "gawsy", "gayal", "gayer", "gayly", "gazar", "gazed", "gazer", "gazes", "gears", "gecko", "gecks", "geeks", "geeky", "geese", "geest", "gelds", "gelee", "gelid", "gelts", "gemma", "gemmy", "gemot", "genes", "genet", "genic", "genie", "genii", "genip", "genoa", "genom", "genre", "genro", "gents", "genua", "genus", "geode", "geoid", "gerah", "germs", "germy", "gesso", "geste", "gests", "getas", "getup", "geums", "ghast", "ghats", "ghaut", "ghazi", "ghees", "ghost", "ghoul", "ghyll", "giant", "gibed", "giber", "gibes", "giddy", "gifts", "gigas", "gighe", "gigot", "gigue", "gilds", "gills", "gilly", "gilts", "gimel", "gimme", "gimps", "gimpy", "ginks", "ginny", "gipon", "gipsy", "girds", "girls", "girly", "girns", "giron", "giros", "girsh", "girth", "girts", "gismo", "gists", "given", "giver", "gives", "gizmo", "glace", "glade", "glads", "glady", "glair", "gland", "glans", "glare", "glary", "glass", "glaze", "glazy", "gleam", "glean", "gleba", "glebe", "glede", "gleds", "gleed", "gleek", "glees", "gleet", "glens", "gleys", "glial", "glias", "glide", "gliff", "glime", "glims", "glint", "glitz", "gloam", "gloat", "globe", "globs", "glogg", "gloms", "gloom", "glops", "glory", "gloss", "glost", "glout", "glove", "glows", "gloze", "glued", "gluer", "glues", "gluey", "glugs", "glume", "gluon", "glute", "gluts", "glyph", "gnarl", "gnarr", "gnars", "gnash", "gnats", "gnawn", "gnaws", "gnome", "goads", "goals", "goats", "goban", "gobos", "godet", "godly", "goers", "gofer", "gogos", "going", "golds", "golem", "golfs", "golly", "gombo", "gonad", "gonef", "goner", "gongs", "gonia", "gonif", "gonof", "gonzo", "goods", "goody", "gooey", "goofs", "goofy", "goons", "goony", "goops", "goopy", "goose", "goosy", "goral", "gored", "gores", "gorge", "gorps", "gorse", "gorsy", "gouge", "gourd", "gouts", "gouty", "gowan", "gowds", "gowks", "gowns", "goxes", "goyim", "graal", "grabs", "grace", "grade", "grads", "graft", "grail", "grain", "grama", "gramp", "grams", "grana", "grand", "grans", "grant", "grape", "graph", "grapy", "grasp", "grass", "grate", "grave", "gravy", "grays", "graze", "great", "grebe", "greed", "greek", "green", "grees", "greet", "grego", "greys", "gride", "grids", "grief", "griff", "grift", "grigs", "grill", "grime", "grimy", "grind", "grins", "griot", "gripe", "grips", "gript", "gripy", "grist", "grith", "grits", "groan", "groat", "grody", "grogs", "groin", "groks", "groom", "grope", "gross", "grosz", "grots", "group", "grout", "grove", "growl", "grown", "grows", "grubs", "gruel", "grues", "gruff", "grume", "grump", "grunt", "guaco", "guano", "guans", "guard", "guars", "guava", "gucks", "gudes", "guess", "guest", "guffs", "guide", "guids", "guild", "guile", "guilt", "guiro", "guise", "gulag", "gular", "gulch", "gules", "gulfs", "gulfy", "gulls", "gully", "gulps", "gulpy", "gumbo", "gumma", "gummy", "gunks", "gunky", "gunny", "guppy", "gurge", "gurry", "gursh", "gurus", "gushy", "gussy", "gusto", "gusts", "gusty", "gutsy", "gutta", "gutty", "guyed", "guyot", "gybed", "gybes", "gyoza", "gypsy", "gyral", "gyred", "gyres", "gyron", "gyros", "gyrus", "gyved", "gyves", "haafs", "haars", "habit", "habus", "hacek", "hacks", "hadal", "haded", "hades", "hadji", "hadst", "haems", "haets", "hafiz", "hafts", "hahas", "haika", "haiks", "haiku", "hails", "hairs", "hairy", "hajes", "hajis", "hajji", "hakes", "hakim", "halal", "haled", "haler", "hales", "halid", "hallo", "halls", "halma", "halms", "halon", "halos", "halts", "halva", "halve", "hamal", "hames", "hammy", "hamza", "hance", "hands", "handy", "hangs", "hanks", "hanky", "hansa", "hanse", "hants", "haole", "hapax", "haply", "happy", "hards", "hardy", "hared", "harem", "hares", "harks", "harls", "harms", "harps", "harpy", "harry", "harsh", "harts", "hasps", "haste", "hasty", "hatch", "hated", "hater", "hates", "haugh", "haulm", "hauls", "haunt", "haute", "haven", "haver", "haves", "havoc", "hawed", "hawks", "hawse", "hayed", "hayer", "hazan", "hazed", "hazel", "hazer", "hazes", "heads", "heady", "heals", "heaps", "heard", "hears", "heart", "heath", "heats", "heave", "heavy", "hebes", "hecks", "heder", "hedge", "hedgy", "heeds", "heels", "heeze", "hefts", "hefty", "heigh", "heirs", "heist", "helio", "helix", "hello", "hells", "helms", "helos", "helot", "helps", "helve", "hemal", "hemes", "hemic", "hemin", "hemps", "hempy", "hence", "henna", "henry", "hents", "herbs", "herby", "herds", "heres", "herls", "herma", "herms", "herns", "heron", "heros", "herry", "hertz", "hests", "heths", "heuch", "heugh", "hewed", "hewer", "hexad", "hexed", "hexer", "hexes", "hexyl", "hicks", "hided", "hider", "hides", "highs", "hight", "hijab", "hiked", "hiker", "hikes", "hilar", "hillo", "hills", "hilly", "hilts", "hilum", "hilus", "hinds", "hinge", "hinky", "hinny", "hints", "hippo", "hippy", "hired", "hiree", "hirer", "hires", "hissy", "hists", "hitch", "hived", "hives", "hoagy", "hoard", "hoars", "hoary", "hobby", "hobos", "hocks", "hocus", "hodad", "hoers", "hogan", "hoggs", "hoick", "hoise", "hoist", "hoked", "hokes", "hokey", "hokku", "hokum", "holds", "holed", "holes", "holey", "holks", "holla", "hollo", "holly", "holms", "holts", "homed", "homer", "homes", "homey", "homie", "homos", "honan", "honda", "honed", "honer", "hones", "honey", "hongs", "honks", "honky", "honor", "hooch", "hoods", "hoody", "hooey", "hoofs", "hooka", "hooks", "hooky", "hooly", "hoops", "hoots", "hooty", "hoped", "hoper", "hopes", "hoppy", "horah", "horal", "horas", "horde", "horns", "horny", "horse", "horst", "horsy", "hosed", "hosel", "hosen", "hoses", "hosta", "hosts", "hotch", "hotel", "hotly", "hound", "houri", "hours", "house", "hovel", "hover", "howdy", "howes", "howff", "howfs", "howks", "howls", "hoyas", "hoyle", "hubby", "hucks", "huffs", "huffy", "huger", "hulas", "hulks", "hulky", "hullo", "hulls", "human", "humic", "humid", "humor", "humph", "humps", "humpy", "humus", "hunch", "hunks", "hunky", "hunts", "hurds", "hurls", "hurly", "hurry", "hurst", "hurts", "husks", "husky", "hussy", "hutch", "huzza", "hydra", "hydro", "hyena", "hying", "hylas", "hymen", "hymns", "hyoid", "hyped", "hyper", "hypes", "hypha", "hypos", "hyrax", "hyson", "iambi", "iambs", "ichor", "icier", "icily", "icing", "icker", "icons", "ictic", "ictus", "ideal", "ideas", "idiom", "idiot", "idled", "idler", "idles", "idols", "idyll", "idyls", "igged", "igloo", "iglus", "ihram", "ikats", "ikons", "ileac", "ileal", "ileum", "ileus", "iliac", "iliad", "ilial", "ilium", "iller", "image", "imago", "imams", "imaum", "imbed", "imbue", "imide", "imido", "imids", "imine", "imino", "immix", "imped", "impel", "impis", "imply", "inane", "inapt", "inarm", "inbye", "incog", "incur", "incus", "index", "indie", "indol", "indow", "indri", "indue", "inept", "inert", "infer", "infix", "infos", "infra", "ingle", "ingot", "inion", "inked", "inker", "inkle", "inlay", "inlet", "inned", "inner", "input", "inset", "inter", "intis", "intro", "inure", "inurn", "invar", "iodic", "iodid", "iodin", "ionic", "iotas", "irade", "irate", "irids", "iring", "irked", "iroko", "irone", "irons", "irony", "isbas", "isled", "isles", "islet", "issei", "issue", "istle", "itchy", "items", "ither", "ivied", "ivies", "ivory", "ixias", "ixora", "ixtle", "izars", "jabot", "jacal", "jacks", "jacky", "jaded", "jades", "jager", "jaggs", "jaggy", "jagra", "jails", "jakes", "jalap", "jalop", "jambe", "jambs", "jammy", "janes", "janty", "japan", "japed", "japer", "japes", "jarls", "jatos", "jauks", "jaunt", "jaups", "javas", "jawan", "jawed", "jazzy", "jeans", "jebel", "jeeps", "jeers", "jefes", "jehad", "jehus", "jello", "jells", "jelly", "jemmy", "jenny", "jerid", "jerks", "jerky", "jerry", "jesse", "jests", "jetes", "jeton", "jetty", "jewel", "jibbs", "jibed", "jiber", "jibes", "jiffs", "jiffy", "jiggy", "jihad", "jills", "jilts", "jimmy", "jimpy", "jingo", "jinks", "jinni", "jinns", "jisms", "jived", "jiver", "jives", "jivey", "jnana", "jocko", "jocks", "joeys", "johns", "joins", "joint", "joist", "joked", "joker", "jokes", "jokey", "joles", "jolly", "jolts", "jolty", "jomon", "jones", "joram", "jorum", "jotas", "jotty", "joual", "jouks", "joule", "joust", "jowar", "jowed", "jowls", "jowly", "joyed", "jubas", "jubes", "jucos", "judas", "judge", "judos", "jugal", "jugum", "juice", "juicy", "jujus", "juked", "jukes", "jukus", "julep", "jumbo", "jumps", "jumpy", "junco", "junks", "junky", "junta", "junto", "jupes", "jupon", "jural", "jurat", "jurel", "juror", "justs", "jutes", "jutty", "kabab", "kabar", "kabob", "kadis", "kafir", "kagus", "kaiak", "kaifs", "kails", "kains", "kakas", "kakis", "kalam", "kales", "kalif", "kalpa", "kames", "kamik", "kanas", "kanes", "kanji", "kanzu", "kaons", "kapas", "kaphs", "kapok", "kappa", "kaput", "karat", "karma", "karns", "karoo", "karst", "karts", "kasha", "katas", "kauri", "kaury", "kavas", "kayak", "kayos", "kazoo", "kbars", "kebab", "kebar", "kebob", "kecks", "kedge", "keefs", "keeks", "keels", "keens", "keeps", "keets", "keeve", "kefir", "keirs", "kelep", "kelim", "kelly", "kelps", "kelpy", "kemps", "kempt", "kenaf", "kench", "kendo", "kenos", "kepis", "kerbs", "kerfs", "kerne", "kerns", "kerry", "ketch", "ketol", "kevel", "kevil", "kexes", "keyed", "khadi", "khafs", "khaki", "khans", "khaph", "khats", "kheda", "kheth", "khets", "khoum", "kiang", "kibbe", "kibbi", "kibei", "kibes", "kibla", "kicks", "kicky", "kiddo", "kiddy", "kiefs", "kiers", "kikes", "kilim", "kills", "kilns", "kilos", "kilts", "kilty", "kinas", "kinds", "kines", "kings", "kinin", "kinks", "kinky", "kinos", "kiosk", "kirks", "kirns", "kissy", "kists", "kited", "kiter", "kites", "kithe", "kiths", "kitty", "kivas", "kiwis", "klong", "kloof", "kluge", "klutz", "knack", "knaps", "knars", "knaur", "knave", "knead", "kneed", "kneel", "knees", "knell", "knelt", "knife", "knish", "knits", "knobs", "knock", "knoll", "knops", "knosp", "knots", "knout", "known", "knows", "knurl", "knurs", "koala", "koans", "kobos", "koels", "kohls", "koine", "kolas", "kolos", "konks", "kooks", "kooky", "kopek", "kophs", "kopje", "koppa", "korai", "koras", "korat", "korun", "kotos", "kotow", "kraal", "kraft", "krait", "kraut", "kreep", "krill", "krona", "krone", "kroon", "krubi", "kudos", "kudus", "kudzu", "kufis", "kugel", "kukri", "kulak", "kumys", "kurta", "kurus", "kusso", "kvass", "kyack", "kyaks", "kyars", "kyats", "kylix", "kyrie", "kytes", "kythe", "laari", "label", "labia", "labor", "labra", "laced", "lacer", "laces", "lacey", "lacks", "laded", "laden", "lader", "lades", "ladle", "laevo", "lagan", "lager", "lahar", "laich", "laics", "laigh", "laird", "lairs", "laith", "laity", "laked", "laker", "lakes", "lakhs", "lalls", "lamas", "lambs", "lamby", "lamed", "lamer", "lames", "lamia", "lamps", "lanai", "lance", "lands", "lanes", "lanky", "lapel", "lapin", "lapis", "lapse", "larch", "lards", "lardy", "laree", "lares", "large", "largo", "laris", "larks", "larky", "larum", "larva", "lased", "laser", "lases", "lasso", "lasts", "latch", "lated", "laten", "later", "latex", "lathe", "lathi", "laths", "lathy", "latke", "latte", "lauan", "lauds", "laugh", "laura", "lavas", "laved", "laver", "laves", "lawed", "lawns", "lawny", "laxer", "laxly", "layed", "layer", "layup", "lazar", "lazed", "lazes", "leach", "leads", "leady", "leafs", "leafy", "leaks", "leaky", "leans", "leant", "leaps", "leapt", "learn", "lears", "leary", "lease", "leash", "least", "leave", "leavy", "leben", "ledge", "ledgy", "leech", "leeks", "leers", "leery", "leets", "lefts", "lefty", "legal", "leger", "leges", "leggy", "legit", "lehrs", "lehua", "leman", "lemma", "lemon", "lemur", "lends", "lenes", "lenis", "lenos", "lense", "lento", "leone", "leper", "lepta", "letch", "lethe", "letup", "leuds", "levee", "level", "lever", "levin", "lewis", "lexes", "lexis", "lezzy", "liana", "liane", "liang", "liard", "liars", "libel", "liber", "libra", "libri", "lichi", "licht", "licit", "licks", "lidar", "lidos", "liege", "liens", "liers", "lieus", "lieve", "lifer", "lifts", "ligan", "liger", "light", "liked", "liken", "liker", "likes", "lilac", "lilts", "liman", "limas", "limba", "limbi", "limbo", "limbs", "limby", "limed", "limen", "limes", "limey", "limit", "limns", "limos", "limpa", "limps", "linac", "lindy", "lined", "linen", "liner", "lines", "liney", "linga", "lingo", "lings", "lingy", "linin", "links", "linky", "linns", "linos", "lints", "linty", "linum", "lions", "lipid", "lipin", "lippy", "liras", "lirot", "lisle", "lisps", "lists", "litai", "litas", "liter", "lithe", "litho", "litre", "lived", "liven", "liver", "lives", "livid", "livre", "llama", "llano", "loach", "loads", "loafs", "loams", "loamy", "loans", "loath", "lobar", "lobby", "lobed", "lobes", "lobos", "local", "lochs", "locks", "locos", "locum", "locus", "loden", "lodes", "lodge", "loess", "lofts", "lofty", "logan", "loges", "loggy", "logia", "logic", "logoi", "logos", "loids", "loins", "lolls", "lolly", "loner", "longe", "longs", "looby", "looed", "looey", "loofa", "loofs", "looie", "looks", "looms", "loons", "loony", "loops", "loopy", "loose", "loots", "loped", "loper", "lopes", "loppy", "loral", "loran", "lords", "lores", "loris", "lorry", "losel", "loser", "loses", "lossy", "lotah", "lotas", "lotic", "lotos", "lotte", "lotto", "lotus", "lough", "louie", "louis", "loupe", "loups", "lours", "loury", "louse", "lousy", "louts", "lovat", "loved", "lover", "loves", "lowed", "lower", "lowes", "lowly", "lowse", "loxed", "loxes", "loyal", "luaus", "lubed", "lubes", "luces", "lucid", "lucks", "lucky", "lucre", "ludes", "ludic", "luffa", "luffs", "luged", "luger", "luges", "lulls", "lulus", "lumen", "lumps", "lumpy", "lunar", "lunas", "lunch", "lunes", "lunet", "lunge", "lungi", "lungs", "lunks", "lunts", "lupin", "lupus", "lurch", "lured", "lurer", "lures", "lurid", "lurks", "lusts", "lusty", "lusus", "lutea", "luted", "lutes", "luxes", "lweis", "lyard", "lyart", "lyase", "lycea", "lycee", "lycra", "lying", "lymph", "lynch", "lyres", "lyric", "lysed", "lyses", "lysin", "lysis", "lyssa", "lytic", "lytta", "maars", "mabes", "macaw", "maced", "macer", "maces", "mache", "macho", "machs", "macks", "macle", "macon", "macro", "madam", "madly", "madre", "mafia", "mafic", "mages", "magic", "magma", "magot", "magus", "mahoe", "maids", "maile", "maill", "mails", "maims", "mains", "mairs", "maist", "maize", "major", "makar", "maker", "makes", "makos", "malar", "males", "malic", "malls", "malms", "malmy", "malts", "malty", "mamas", "mamba", "mambo", "mamey", "mamie", "mamma", "mammy", "manas", "maned", "manes", "mange", "mango", "mangy", "mania", "manic", "manly", "manna", "manor", "manos", "manse", "manta", "manus", "maple", "maqui", "maras", "march", "marcs", "mares", "marge", "maria", "marks", "marls", "marly", "marry", "marse", "marsh", "marts", "marvy", "maser", "mashy", "masks", "mason", "massa", "masse", "massy", "masts", "match", "mated", "mater", "mates", "matey", "maths", "matin", "matte", "matts", "matza", "matzo", "mauds", "mauls", "maund", "mauts", "mauve", "maven", "mavie", "mavin", "mavis", "mawed", "maxed", "maxes", "maxim", "maxis", "mayan", "mayas", "maybe", "mayed", "mayor", "mayos", "mayst", "mazed", "mazer", "mazes", "mbira", "meads", "meals", "mealy", "means", "meant", "meany", "meats", "meaty", "mecca", "medal", "media", "medic", "medii", "meeds", "meets", "meiny", "melds", "melee", "melic", "mells", "melon", "melts", "memos", "menad", "mends", "mensa", "mense", "menta", "menus", "meous", "meows", "mercy", "merde", "merer", "meres", "merge", "merit", "merks", "merle", "merls", "merry", "mesas", "meshy", "mesic", "mesne", "meson", "messy", "metal", "meted", "meter", "metes", "meths", "metis", "metre", "metro", "mewed", "mewls", "mezes", "mezzo", "miaou", "miaow", "miasm", "miaul", "micas", "miche", "micks", "micra", "micro", "middy", "midge", "midis", "midst", "miens", "miffs", "miffy", "miggs", "might", "miked", "mikes", "mikra", "milch", "miler", "miles", "milia", "milks", "milky", "mille", "mills", "milos", "milpa", "milts", "milty", "mimed", "mimeo", "mimer", "mimes", "mimic", "minae", "minas", "mince", "mincy", "minds", "mined", "miner", "mines", "mingy", "minim", "minis", "minke", "minks", "minny", "minor", "mints", "minty", "minus", "mired", "mires", "mirex", "mirks", "mirky", "mirth", "mirza", "misdo", "miser", "mises", "misos", "missy", "mists", "misty", "miter", "mites", "mitis", "mitre", "mitts", "mixed", "mixer", "mixes", "mixup", "mizen", "moans", "moats", "mocha", "mocks", "modal", "model", "modem", "modes", "modus", "moggy", "mogul", "mohel", "mohur", "moils", "moira", "moire", "moist", "mojos", "mokes", "molal", "molar", "molas", "molds", "moldy", "moles", "molls", "molly", "molto", "molts", "momes", "momma", "mommy", "momus", "monad", "monas", "monde", "mondo", "money", "mongo", "monie", "monks", "monos", "monte", "month", "mooch", "moods", "moody", "mooed", "moola", "mools", "moons", "moony", "moors", "moory", "moose", "moots", "moped", "moper", "mopes", "mopey", "morae", "moral", "moras", "moray", "morel", "mores", "morns", "moron", "morph", "morro", "morse", "morts", "mosey", "mosks", "mosso", "mossy", "moste", "mosts", "motel", "motes", "motet", "motey", "moths", "mothy", "motif", "motor", "motte", "motto", "motts", "mouch", "moues", "mould", "moult", "mound", "mount", "mourn", "mouse", "mousy", "mouth", "moved", "mover", "moves", "movie", "mowed", "mower", "moxas", "moxie", "mozos", "mucid", "mucin", "mucks", "mucky", "mucor", "mucro", "mucus", "muddy", "mudra", "muffs", "mufti", "muggs", "muggy", "muhly", "mujik", "mulch", "mulct", "muled", "mules", "muley", "mulla", "mulls", "mumms", "mummy", "mumps", "mumus", "munch", "mungo", "munis", "muons", "mural", "muras", "mured", "mures", "murex", "murid", "murks", "murky", "murra", "murre", "murrs", "murry", "musca", "mused", "muser", "muses", "mushy", "music", "musks", "musky", "mussy", "musth", "musts", "musty", "mutch", "muted", "muter", "mutes", "muton", "mutts", "muzzy", "mynah", "mynas", "myoid", "myoma", "myope", "myopy", "myrrh", "mysid", "myths", "mythy", "naans", "nabes", "nabis", "nabob", "nacho", "nacre", "nadas", "nadir", "naevi", "naggy", "naiad", "naifs", "nails", "naira", "naive", "naked", "naled", "named", "namer", "names", "nanas", "nance", "nancy", "nanny", "napes", "nappe", "nappy", "narco", "narcs", "nards", "nares", "naric", "naris", "narks", "narky", "nasal", "nasty", "natal", "natch", "nates", "natty", "naval", "navar", "navel", "naves", "navvy", "nawab", "neaps", "nears", "neath", "neats", "necks", "needs", "needy", "neems", "neeps", "negus", "neifs", "neigh", "neist", "nelly", "nemas", "neons", "nerds", "nerdy", "nerol", "nerts", "nertz", "nerve", "nervy", "nests", "netop", "netts", "netty", "neuks", "neume", "neums", "never", "neves", "nevus", "newel", "newer", "newie", "newly", "newsy", "newts", "nexus", "ngwee", "nicad", "nicer", "niche", "nicks", "nicol", "nidal", "nided", "nides", "nidus", "niece", "nieve", "nifty", "nighs", "night", "nihil", "nills", "nimbi", "nines", "ninja", "ninny", "ninon", "ninth", "nipas", "nippy", "nisei", "nisus", "niter", "nites", "nitid", "niton", "nitre", "nitro", "nitty", "nival", "nixed", "nixes", "nixie", "nizam", "nobby", "noble", "nobly", "nocks", "nodal", "noddy", "nodes", "nodus", "noels", "noggs", "nohow", "noils", "noily", "noirs", "noise", "noisy", "nolos", "nomad", "nomas", "nomen", "nomes", "nomoi", "nomos", "nonas", "nonce", "nones", "nonet", "nonyl", "nooks", "nooky", "noons", "noose", "nopal", "noria", "noris", "norms", "north", "nosed", "noses", "nosey", "notal", "notch", "noted", "noter", "notes", "notum", "nouns", "novae", "novas", "novel", "noway", "nowts", "nubby", "nubia", "nucha", "nuder", "nudes", "nudge", "nudie", "nudzh", "nuked", "nukes", "nulls", "numbs", "numen", "nurds", "nurls", "nurse", "nutsy", "nutty", "nyala", "nylon", "nymph", "oaken", "oakum", "oared", "oases", "oasis", "oasts", "oaten", "oater", "oaths", "oaves", "obeah", "obeli", "obese", "obeys", "obias", "obits", "objet", "oboes", "obole", "oboli", "obols", "occur", "ocean", "ocher", "ochre", "ochry", "ocker", "ocrea", "octad", "octal", "octan", "octet", "octyl", "oculi", "odahs", "odder", "oddly", "odeon", "odeum", "odist", "odium", "odors", "odour", "odyle", "odyls", "ofays", "offal", "offed", "offer", "often", "ofter", "ogams", "ogees", "ogham", "ogive", "ogled", "ogler", "ogles", "ogres", "ohias", "ohing", "ohmic", "oidia", "oiled", "oiler", "oinks", "okapi", "okays", "okehs", "okras", "olden", "older", "oldie", "oleic", "olein", "oleos", "oleum", "olios", "olive", "ollas", "ology", "omasa", "omber", "ombre", "omega", "omens", "omers", "omits", "onery", "onion", "onium", "onset", "ontic", "oohed", "oomph", "oorie", "ootid", "oozed", "oozes", "opahs", "opals", "opens", "opera", "opine", "oping", "opium", "opsin", "opted", "optic", "orach", "orals", "orang", "orate", "orbed", "orbit", "orcas", "orcin", "order", "ordos", "oread", "organ", "orgic", "oribi", "oriel", "orles", "orlop", "ormer", "ornis", "orpin", "orris", "ortho", "orzos", "osier", "osmic", "osmol", "ossia", "ostia", "other", "ottar", "otter", "ottos", "ought", "ounce", "ouphe", "ouphs", "ourie", "ousel", "ousts", "outby", "outdo", "outed", "outer", "outgo", "outre", "ouzel", "ouzos", "ovals", "ovary", "ovate", "ovens", "overs", "overt", "ovine", "ovoid", "ovoli", "ovolo", "ovule", "owing", "owlet", "owned", "owner", "owsen", "oxbow", "oxeye", "oxide", "oxids", "oxime", "oxims", "oxlip", "oxter", "oyers", "ozone", "pacas", "paced", "pacer", "paces", "pacha", "packs", "pacts", "paddy", "padis", "padle", "padre", "padri", "paean", "paeon", "pagan", "paged", "pager", "pages", "pagod", "paiks", "pails", "pains", "paint", "pairs", "paisa", "paise", "palea", "paled", "paler", "pales", "palet", "palls", "pally", "palms", "palmy", "palpi", "palps", "palsy", "pampa", "panda", "pandy", "paned", "panel", "panes", "panga", "pangs", "panic", "panne", "pansy", "panto", "pants", "panty", "papal", "papas", "papaw", "paper", "pappi", "pappy", "paras", "parch", "pardi", "pards", "pardy", "pared", "pareo", "parer", "pares", "pareu", "parge", "pargo", "paris", "parka", "parks", "parle", "parol", "parrs", "parry", "parse", "parts", "party", "parve", "parvo", "paseo", "pases", "pasha", "passe", "pasta", "paste", "pasts", "pasty", "patch", "pated", "paten", "pater", "pates", "paths", "patin", "patio", "patly", "patsy", "patty", "pause", "pavan", "paved", "paver", "paves", "pavid", "pavin", "pavis", "pawed", "pawer", "pawky", "pawls", "pawns", "paxes", "payed", "payee", "payer", "payor", "peace", "peach", "peage", "peags", "peaks", "peaky", "peals", "peans", "pearl", "pears", "peart", "pease", "peats", "peaty", "peavy", "pecan", "pechs", "pecks", "pecky", "pedal", "pedes", "pedro", "peeks", "peels", "peens", "peeps", "peers", "peery", "peeve", "peins", "peise", "pekan", "pekes", "pekin", "pekoe", "peles", "pelfs", "pelon", "pelts", "penal", "pence", "pends", "penes", "pengo", "penis", "penna", "penne", "penni", "penny", "peons", "peony", "pepla", "pepos", "peppy", "perch", "perdu", "perdy", "perea", "peres", "peril", "peris", "perks", "perky", "perms", "perps", "perry", "perse", "pervs", "pesky", "pesos", "pesto", "pests", "pesty", "petal", "peter", "petit", "petti", "petto", "petty", "pewee", "pewit", "phage", "phase", "phial", "phlox", "phone", "phono", "phons", "phony", "photo", "phots", "phpht", "phuts", "phyla", "phyle", "piano", "pians", "pibal", "pical", "picas", "picks", "picky", "picot", "picul", "piece", "piers", "pieta", "piety", "piggy", "pigmy", "piing", "pikas", "piked", "piker", "pikes", "pikis", "pilaf", "pilar", "pilau", "pilaw", "pilea", "piled", "pilei", "piles", "pilis", "pills", "pilot", "pilus", "pimas", "pimps", "pinas", "pinch", "pined", "pines", "piney", "pingo", "pings", "pinko", "pinks", "pinky", "pinna", "pinny", "pinon", "pinot", "pinta", "pinto", "pints", "pinup", "pions", "pious", "pipal", "piped", "piper", "pipes", "pipet", "pipit", "pique", "pirns", "pirog", "pisco", "pisos", "piste", "pitas", "pitch", "piths", "pithy", "piton", "pivot", "pixel", "pixes", "pixie", "pizza", "place", "plack", "plage", "plaid", "plain", "plait", "plane", "plank", "plans", "plant", "plash", "plasm", "plate", "plats", "platy", "playa", "plays", "plaza", "plead", "pleas", "pleat", "plebe", "plebs", "plena", "plews", "plica", "plied", "plier", "plies", "plink", "plods", "plonk", "plops", "plots", "plotz", "plows", "ploys", "pluck", "plugs", "plumb", "plume", "plump", "plums", "plumy", "plunk", "plush", "plyer", "poach", "pocks", "pocky", "podgy", "podia", "poems", "poesy", "poets", "pogey", "poilu", "poind", "point", "poise", "poked", "poker", "pokes", "pokey", "polar", "poled", "poler", "poles", "polio", "polis", "polka", "polls", "polos", "polyp", "polys", "pomes", "pommy", "pomos", "pomps", "ponce", "ponds", "pones", "pongs", "pooch", "poods", "pooed", "poofs", "poofy", "poohs", "pools", "poons", "poops", "poori", "poove", "popes", "poppa", "poppy", "popsy", "porch", "pored", "pores", "porgy", "porks", "porky", "porno", "porns", "porny", "ports", "posed", "poser", "poses", "posit", "posse", "posts", "potsy", "potto", "potty", "pouch", "pouff", "poufs", "poult", "pound", "pours", "pouts", "pouty", "power", "poxed", "poxes", "poyou", "praam", "prahu", "prams", "prang", "prank", "praos", "prase", "prate", "prats", "praus", "prawn", "prays", "preed", "preen", "prees", "preps", "presa", "prese", "press", "prest", "prexy", "preys", "price", "prick", "pricy", "pride", "pried", "prier", "pries", "prigs", "prill", "prima", "prime", "primi", "primo", "primp", "prims", "prink", "print", "prion", "prior", "prise", "prism", "priss", "privy", "prize", "proas", "probe", "prods", "proem", "profs", "progs", "prole", "promo", "proms", "prone", "prong", "proof", "props", "prose", "proso", "pross", "prost", "prosy", "proud", "prove", "prowl", "prows", "proxy", "prude", "prune", "pruta", "pryer", "psalm", "pseud", "pshaw", "psoae", "psoai", "psoas", "psych", "pubes", "pubic", "pubis", "puces", "pucka", "pucks", "pudgy", "pudic", "puffs", "puffy", "puggy", "pujah", "pujas", "puked", "pukes", "pukka", "puled", "puler", "pules", "pulik", "pulis", "pulls", "pulps", "pulpy", "pulse", "pumas", "pumps", "punas", "punch", "pungs", "punji", "punka", "punks", "punky", "punny", "punto", "punts", "punty", "pupae", "pupal", "pupas", "pupil", "puppy", "pupus", "purda", "puree", "purer", "purge", "purin", "puris", "purls", "purrs", "purse", "pursy", "puses", "pushy", "pussy", "puton", "putti", "putto", "putts", "putty", "pygmy", "pyins", "pylon", "pyoid", "pyran", "pyres", "pyric", "pyros", "pyxes", "pyxie", "pyxis", "qadis", "qaids", "qanat", "qophs", "quack", "quads", "quaff", "quags", "quail", "quais", "quake", "quaky", "quale", "qualm", "quant", "quare", "quark", "quart", "quash", "quasi", "quass", "quate", "quays", "qubit", "quean", "queen", "queer", "quell", "quern", "query", "quest", "queue", "queys", "quick", "quids", "quiet", "quiff", "quill", "quilt", "quins", "quint", "quips", "quipu", "quire", "quirk", "quirt", "quite", "quits", "quods", "quoin", "quoit", "quoll", "quota", "quote", "quoth", "qursh", "rabat", "rabbi", "rabic", "rabid", "raced", "racer", "races", "racks", "racon", "radar", "radii", "radio", "radix", "radon", "raffs", "rafts", "ragas", "raged", "ragee", "rages", "raggs", "raggy", "ragis", "raias", "raids", "rails", "rains", "rainy", "raise", "rajah", "rajas", "rajes", "raked", "rakee", "raker", "rakes", "rakis", "rakus", "rales", "rally", "ralph", "ramee", "ramen", "ramet", "ramie", "rammy", "ramps", "ramus", "rance", "ranch", "rands", "randy", "ranee", "range", "rangy", "ranid", "ranis", "ranks", "rants", "raped", "raper", "rapes", "raphe", "rapid", "rared", "rarer", "rares", "rased", "raser", "rases", "rasps", "raspy", "ratal", "ratan", "ratch", "rated", "ratel", "rater", "rates", "rathe", "ratio", "ratos", "ratty", "raved", "ravel", "raven", "raver", "raves", "ravin", "rawer", "rawin", "rawly", "raxed", "raxes", "rayah", "rayas", "rayed", "rayon", "razed", "razee", "razer", "razes", "razor", "reach", "react", "readd", "reads", "ready", "realm", "reals", "reams", "reaps", "rearm", "rears", "reata", "reave", "rebar", "rebbe", "rebec", "rebel", "rebid", "rebop", "rebus", "rebut", "rebuy", "recap", "recce", "recks", "recon", "recta", "recti", "recto", "recur", "recut", "redan", "redds", "reded", "redes", "redia", "redid", "redip", "redly", "redon", "redos", "redox", "redry", "redub", "redux", "redye", "reeds", "reedy", "reefs", "reefy", "reeks", "reeky", "reels", "reest", "reeve", "refed", "refel", "refer", "refit", "refix", "refly", "refry", "regal", "reges", "regma", "regna", "rehab", "rehem", "reifs", "reify", "reign", "reink", "reins", "reive", "rekey", "relax", "relay", "relet", "relic", "relit", "reman", "remap", "remet", "remex", "remit", "remix", "renal", "rends", "renew", "renig", "renin", "rente", "rents", "reoil", "repay", "repeg", "repel", "repin", "reply", "repos", "repot", "repps", "repro", "reran", "rerig", "rerun", "resaw", "resay", "resee", "reset", "resew", "resid", "resin", "resod", "resow", "rests", "retag", "retax", "retch", "retem", "retia", "retie", "retro", "retry", "reuse", "revel", "revet", "revue", "rewan", "rewax", "rewed", "rewet", "rewin", "rewon", "rexes", "rheas", "rheum", "rhino", "rhomb", "rhumb", "rhyme", "rhyta", "rials", "riant", "riata", "ribby", "ribes", "riced", "ricer", "rices", "ricin", "ricks", "rider", "rides", "ridge", "ridgy", "riels", "rifer", "riffs", "rifle", "rifts", "right", "rigid", "rigor", "riled", "riles", "riley", "rille", "rills", "rimed", "rimer", "rimes", "rinds", "rings", "rinks", "rinse", "rioja", "riots", "riped", "ripen", "riper", "ripes", "risen", "riser", "rises", "rishi", "risks", "risky", "risus", "rites", "ritzy", "rival", "rived", "riven", "river", "rives", "rivet", "riyal", "roach", "roads", "roams", "roans", "roars", "roast", "robed", "robes", "robin", "roble", "robot", "rocks", "rocky", "rodeo", "roger", "rogue", "roils", "roily", "roles", "rolfs", "rolls", "roman", "romeo", "romps", "rondo", "roods", "roofs", "rooks", "rooky", "rooms", "roomy", "roose", "roost", "roots", "rooty", "roped", "roper", "ropes", "ropey", "roque", "rosed", "roses", "roset", "rosin", "rotas", "rotch", "rotes", "rotis", "rotls", "rotor", "rotos", "rotte", "rouen", "roues", "rouge", "rough", "round", "roups", "roupy", "rouse", "roust", "route", "routh", "routs", "roved", "roven", "rover", "roves", "rowan", "rowdy", "rowed", "rowel", "rowen", "rower", "rowth", "royal", "ruana", "rubes", "ruble", "rubus", "ruche", "rucks", "rudds", "ruddy", "ruder", "ruers", "ruffe", "ruffs", "rugae", "rugal", "rugby", "ruing", "ruins", "ruled", "ruler", "rules", "rumba", "rumen", "rummy", "rumor", "rumps", "runes", "rungs", "runic", "runny", "runts", "runty", "rupee", "rural", "ruses", "rushy", "rusks", "rusts", "rusty", "ruths", "rutin", "rutty", "ryked", "rykes", "rynds", "ryots", "sabed", "saber", "sabes", "sabin", "sabir", "sable", "sabot", "sabra", "sabre", "sacks", "sacra", "sades", "sadhe", "sadhu", "sadis", "sadly", "safer", "safes", "sagas", "sager", "sages", "saggy", "sagos", "sagum", "sahib", "saice", "saids", "saiga", "sails", "sains", "saint", "saith", "sajou", "saker", "sakes", "sakis", "salad", "salal", "salep", "sales", "salic", "sally", "salmi", "salol", "salon", "salpa", "salps", "salsa", "salts", "salty", "salve", "salvo", "samba", "sambo", "samek", "samps", "sands", "sandy", "saned", "saner", "sanes", "sanga", "sangh", "santo", "sapid", "sapor", "sappy", "saran", "sards", "saree", "sarge", "sarin", "saris", "sarks", "sarky", "sarod", "saros", "sasin", "sassy", "satay", "sated", "satem", "sates", "satin", "satis", "satyr", "sauce", "sauch", "saucy", "saugh", "sauls", "sault", "sauna", "saury", "saute", "saved", "saver", "saves", "savin", "savor", "savoy", "savvy", "sawed", "sawer", "saxes", "sayer", "sayid", "sayst", "scabs", "scads", "scags", "scald", "scale", "scall", "scalp", "scaly", "scamp", "scams", "scans", "scant", "scape", "scare", "scarf", "scarp", "scars", "scart", "scary", "scats", "scatt", "scaup", "scaur", "scena", "scend", "scene", "scent", "schav", "schmo", "schul", "schwa", "scion", "scoff", "scold", "scone", "scoop", "scoot", "scope", "scops", "score", "scorn", "scots", "scour", "scout", "scowl", "scows", "scrag", "scram", "scrap", "scree", "screw", "scrim", "scrip", "scrod", "scrub", "scrum", "scuba", "scudi", "scudo", "scuds", "scuff", "sculk", "scull", "sculp", "scums", "scups", "scurf", "scuta", "scute", "scuts", "seals", "seams", "seamy", "sears", "seats", "sebum", "secco", "sects", "sedan", "seder", "sedge", "sedgy", "sedum", "seeds", "seedy", "seeks", "seels", "seely", "seems", "seeps", "seepy", "seers", "segni", "segno", "segos", "segue", "seifs", "seine", "seise", "seism", "seize", "selah", "selfs", "selle", "sells", "selva", "semen", "semes", "semis", "sends", "sengi", "senna", "senor", "sensa", "sense", "sente", "senti", "sepal", "sepia", "sepic", "sepoy", "septa", "septs", "serac", "serai", "seral", "sered", "serer", "seres", "serfs", "serge", "serif", "serin", "serow", "serry", "serum", "serve", "servo", "setae", "setal", "seton", "setts", "setup", "seven", "sever", "sewan", "sewar", "sewed", "sewer", "sexed", "sexes", "sexto", "sexts", "shack", "shade", "shads", "shady", "shaft", "shags", "shahs", "shake", "shako", "shaky", "shale", "shall", "shalt", "shaly", "shame", "shams", "shank", "shape", "shard", "share", "shark", "sharn", "sharp", "shaul", "shave", "shawl", "shawm", "shawn", "shaws", "shays", "sheaf", "sheal", "shear", "sheas", "sheds", "sheen", "sheep", "sheer", "sheet", "sheik", "shelf", "shell", "shend", "shent", "sheol", "sherd", "shewn", "shews", "shied", "shiel", "shier", "shies", "shift", "shill", "shily", "shims", "shine", "shins", "shiny", "ships", "shire", "shirk", "shirr", "shirt", "shist", "shits", "shiva", "shive", "shivs", "shlep", "shoal", "shoat", "shock", "shoed", "shoer", "shoes", "shogs", "shoji", "shone", "shook", "shool", "shoon", "shoos", "shoot", "shops", "shore", "shorl", "shorn", "short", "shote", "shots", "shott", "shout", "shove", "shown", "shows", "showy", "shoyu", "shred", "shrew", "shris", "shrub", "shrug", "shtik", "shuck", "shuln", "shuls", "shuns", "shunt", "shush", "shute", "shuts", "shwas", "shyer", "shyly", "sials", "sibbs", "sibyl", "sices", "sicko", "sicks", "sided", "sides", "sidhe", "sidle", "siege", "sieur", "sieve", "sifts", "sighs", "sight", "sigil", "sigma", "signs", "sikas", "siker", "sikes", "silds", "silex", "silks", "silky", "sills", "silly", "silos", "silts", "silty", "silva", "simar", "simas", "simps", "since", "sines", "sinew", "singe", "sings", "sinhs", "sinks", "sinus", "siped", "sipes", "sired", "siree", "siren", "sires", "sirra", "sirup", "sisal", "sises", "sissy", "sitar", "sited", "sites", "situp", "situs", "siver", "sixes", "sixmo", "sixte", "sixth", "sixty", "sizar", "sized", "sizer", "sizes", "skags", "skald", "skate", "skats", "skean", "skeed", "skeen", "skees", "skeet", "skegs", "skein", "skelm", "skelp", "skene", "skeps", "skews", "skids", "skied", "skier", "skies", "skiey", "skiff", "skill", "skimo", "skimp", "skims", "skink", "skins", "skint", "skips", "skirl", "skirr", "skirt", "skite", "skits", "skive", "skoal", "skort", "skosh", "skuas", "skulk", "skull", "skunk", "skyed", "skyey", "slabs", "slack", "slags", "slain", "slake", "slams", "slang", "slank", "slant", "slaps", "slash", "slate", "slats", "slaty", "slave", "slaws", "slays", "sleds", "sleek", "sleep", "sleet", "slept", "slews", "slice", "slick", "slide", "slier", "slily", "slime", "slims", "slimy", "sling", "slink", "slipe", "slips", "slipt", "slits", "slobs", "sloes", "slogs", "sloid", "slojd", "sloop", "slope", "slops", "slosh", "sloth", "slots", "slows", "sloyd", "slubs", "slued", "slues", "sluff", "slugs", "slump", "slums", "slung", "slunk", "slurb", "slurp", "slurs", "slush", "slyer", "slyly", "slype", "smack", "small", "smalt", "smarm", "smart", "smash", "smaze", "smear", "smeek", "smell", "smelt", "smerk", "smews", "smile", "smirk", "smite", "smith", "smock", "smogs", "smoke", "smoky", "smolt", "smote", "smuts", "snack", "snafu", "snags", "snail", "snake", "snaky", "snaps", "snare", "snark", "snarl", "snash", "snath", "snaws", "sneak", "sneap", "sneck", "sneds", "sneer", "snell", "snibs", "snick", "snide", "sniff", "snipe", "snips", "snits", "snobs", "snogs", "snood", "snook", "snool", "snoop", "snoot", "snore", "snort", "snots", "snout", "snows", "snowy", "snubs", "snuck", "snuff", "snugs", "snyes", "soaks", "soaps", "soapy", "soars", "soave", "sober", "socko", "socks", "socle", "sodas", "soddy", "sodic", "sodom", "sofar", "sofas", "softa", "softs", "softy", "soggy", "soils", "sojas", "sokes", "sokol", "solan", "solar", "soldi", "soldo", "soled", "solei", "soles", "solid", "solon", "solos", "solum", "solus", "solve", "somas", "sonar", "sonde", "sones", "songs", "sonic", "sonly", "sonny", "sonsy", "sooey", "sooks", "sooth", "soots", "sooty", "sophs", "sophy", "sopor", "soppy", "soras", "sorbs", "sords", "sorel", "sorer", "sores", "sorgo", "sorns", "sorry", "sorts", "sorus", "soths", "sotol", "sough", "souks", "souls", "sound", "soups", "soupy", "sours", "souse", "south", "sowar", "sowed", "sower", "soyas", "soyuz", "sozin", "space", "spacy", "spade", "spado", "spaed", "spaes", "spahi", "spail", "spait", "spake", "spale", "spall", "spang", "spank", "spans", "spare", "spark", "spars", "spasm", "spate", "spats", "spawn", "spays", "speak", "spean", "spear", "speck", "specs", "speed", "speel", "speer", "speil", "speir", "spell", "spelt", "spend", "spent", "sperm", "spews", "spica", "spice", "spicy", "spied", "spiel", "spier", "spies", "spiff", "spike", "spiks", "spiky", "spile", "spill", "spilt", "spine", "spins", "spiny", "spire", "spirt", "spiry", "spite", "spits", "spitz", "spivs", "splat", "splay", "split", "spode", "spoil", "spoke", "spoof", "spook", "spool", "spoon", "spoor", "spore", "sport", "spots", "spout", "sprag", "sprat", "spray", "spree", "sprig", "sprit", "sprue", "sprug", "spuds", "spued", "spues", "spume", "spumy", "spunk", "spurn", "spurs", "spurt", "sputa", "squab", "squad", "squat", "squaw", "squeg", "squib", "squid", "stabs", "stack", "stade", "staff", "stage", "stags", "stagy", "staid", "staig", "stain", "stair", "stake", "stale", "stalk", "stall", "stamp", "stand", "stane", "stang", "stank", "staph", "stare", "stark", "stars", "start", "stash", "state", "stats", "stave", "stays", "stead", "steak", "steal", "steam", "steed", "steek", "steel", "steep", "steer", "stein", "stela", "stele", "stems", "steno", "stent", "steps", "stere", "stern", "stets", "stews", "stich", "stick", "stied", "sties", "stiff", "stile", "still", "stilt", "stime", "stimy", "sting", "stink", "stint", "stipe", "stirk", "stirp", "stirs", "stoae", "stoai", "stoas", "stoat", "stobs", "stock", "stogy", "stoic", "stoke", "stole", "stoma", "stomp", "stone", "stony", "stood", "stook", "stool", "stoop", "stope", "stops", "stopt", "store", "stork", "storm", "story", "stoss", "stots", "stoup", "stour", "stout", "stove", "stowp", "stows", "strap", "straw", "stray", "strep", "strew", "stria", "strip", "strop", "strow", "stroy", "strum", "strut", "stubs", "stuck", "studs", "study", "stuff", "stull", "stump", "stums", "stung", "stunk", "stuns", "stunt", "stupa", "stupe", "sturt", "styed", "styes", "style", "styli", "stymy", "suave", "subah", "subas", "suber", "sucks", "sucky", "sucre", "sudds", "sudor", "sudsy", "suede", "suers", "suets", "suety", "sugar", "sughs", "suing", "suint", "suite", "suits", "sulci", "sulfa", "sulfo", "sulks", "sulky", "sully", "sulus", "sumac", "summa", "sumos", "sumps", "sunna", "sunns", "sunny", "sunup", "super", "supes", "supra", "surah", "sural", "suras", "surds", "surer", "surfs", "surfy", "surge", "surgy", "surly", "surra", "sushi", "sutra", "sutta", "swabs", "swage", "swags", "swail", "swain", "swale", "swami", "swamp", "swamy", "swang", "swank", "swans", "swaps", "sward", "sware", "swarf", "swarm", "swart", "swash", "swath", "swats", "sways", "swear", "sweat", "swede", "sweep", "sweer", "sweet", "swell", "swept", "swift", "swigs", "swill", "swims", "swine", "swing", "swink", "swipe", "swirl", "swish", "swiss", "swith", "swive", "swobs", "swoon", "swoop", "swops", "sword", "swore", "sworn", "swots", "swoun", "swung", "sycee", "syces", "sykes", "sylis", "sylph", "sylva", "synch", "syncs", "synod", "synth", "syphs", "syren", "syrup", "sysop", "tabby", "taber", "tabes", "tabid", "tabla", "table", "taboo", "tabor", "tabun", "tabus", "taces", "tacet", "tache", "tachs", "tacit", "tacks", "tacky", "tacos", "tacts", "taels", "taffy", "tafia", "tahrs", "taiga", "tails", "tains", "taint", "tajes", "taken", "taker", "takes", "takin", "talar", "talas", "talcs", "taler", "tales", "talks", "talky", "tally", "talon", "taluk", "talus", "tamal", "tamed", "tamer", "tames", "tamis", "tammy", "tamps", "tango", "tangs", "tangy", "tanka", "tanks", "tansy", "tanto", "tapas", "taped", "taper", "tapes", "tapir", "tapis", "tardo", "tardy", "tared", "tares", "targe", "tarns", "taroc", "tarok", "taros", "tarot", "tarps", "tarre", "tarry", "tarsi", "tarts", "tarty", "tasks", "tasse", "taste", "tasty", "tatar", "tater", "tates", "tatty", "taunt", "taupe", "tauts", "tawed", "tawer", "tawie", "tawny", "tawse", "taxed", "taxer", "taxes", "taxis", "taxon", "taxus", "tazza", "tazze", "teach", "teaks", "teals", "teams", "tears", "teary", "tease", "teats", "techy", "tecta", "teddy", "teels", "teems", "teens", "teeny", "teeth", "teffs", "teggs", "tegua", "teiid", "teind", "telae", "teles", "telex", "telia", "telic", "tells", "telly", "teloi", "telos", "tempi", "tempo", "temps", "tempt", "tench", "tends", "tenet", "tenia", "tenon", "tenor", "tense", "tenth", "tents", "tenty", "tepal", "tepas", "tepee", "tepid", "tepoy", "terai", "terce", "terga", "terms", "terne", "terns", "terra", "terry", "terse", "tesla", "testa", "tests", "testy", "teths", "tetra", "teuch", "teugh", "tewed", "texas", "texts", "thack", "thane", "thank", "tharm", "thaws", "thebe", "theca", "theft", "thegn", "thein", "their", "theme", "thens", "there", "therm", "these", "theta", "thews", "thewy", "thick", "thief", "thigh", "thill", "thine", "thing", "think", "thins", "thiol", "third", "thirl", "thole", "thong", "thorn", "thoro", "thorp", "those", "thous", "thraw", "three", "threw", "thrip", "throb", "throe", "throw", "thrum", "thuds", "thugs", "thuja", "thumb", "thump", "thunk", "thurl", "thuya", "thyme", "thymi", "thymy", "tiara", "tibia", "tical", "ticks", "tidal", "tided", "tides", "tiers", "tiffs", "tiger", "tight", "tigon", "tikes", "tikis", "tilak", "tilde", "tiled", "tiler", "tiles", "tills", "tilth", "tilts", "timed", "timer", "times", "timid", "tinct", "tinea", "tined", "tines", "tinge", "tings", "tinny", "tints", "tipis", "tippy", "tipsy", "tired", "tires", "tirls", "tiros", "titan", "titer", "tithe", "titis", "title", "titre", "titty", "tizzy", "toads", "toady", "toast", "today", "toddy", "toffs", "toffy", "tofts", "tofus", "togae", "togas", "togue", "toile", "toils", "toits", "tokay", "toked", "token", "toker", "tokes", "tolan", "tolas", "toled", "toles", "tolls", "tolus", "tolyl", "toman", "tombs", "tomes", "tommy", "tonal", "tondi", "tondo", "toned", "toner", "tones", "toney", "tonga", "tongs", "tonic", "tonne", "tonus", "tools", "toons", "tooth", "toots", "topaz", "toped", "topee", "toper", "topes", "tophe", "tophi", "tophs", "topic", "topis", "topoi", "topos", "toque", "torah", "toras", "torch", "torcs", "tores", "toric", "torii", "toros", "torot", "torse", "torsi", "torsk", "torso", "torte", "torts", "torus", "total", "toted", "totem", "toter", "totes", "touch", "tough", "tours", "touse", "touts", "towed", "towel", "tower", "towie", "towns", "towny", "toxic", "toxin", "toyed", "toyer", "toyon", "toyos", "trace", "track", "tract", "trade", "tragi", "traik", "trail", "train", "trait", "tramp", "trams", "trank", "tranq", "trans", "traps", "trapt", "trash", "trass", "trave", "trawl", "trays", "tread", "treat", "treed", "treen", "trees", "treks", "trend", "tress", "trets", "trews", "treys", "triac", "triad", "trial", "tribe", "trice", "trick", "tried", "trier", "tries", "trigo", "trigs", "trike", "trill", "trims", "trine", "triol", "trios", "tripe", "trips", "trite", "troak", "trock", "trode", "trois", "troke", "troll", "tromp", "trona", "trone", "troop", "trooz", "trope", "troth", "trots", "trout", "trove", "trows", "troys", "truce", "truck", "trued", "truer", "trues", "trugs", "trull", "truly", "trump", "trunk", "truss", "trust", "truth", "tryma", "tryst", "tsade", "tsadi", "tsars", "tsked", "tsuba", "tubae", "tubal", "tubas", "tubby", "tubed", "tuber", "tubes", "tucks", "tufas", "tuffs", "tufts", "tufty", "tules", "tulip", "tulle", "tumid", "tummy", "tumor", "tumps", "tunas", "tuned", "tuner", "tunes", "tungs", "tunic", "tunny", "tupik", "tuque", "turbo", "turds", "turfs", "turfy", "turks", "turns", "turps", "tushy", "tusks", "tutee", "tutor", "tutti", "tutty", "tutus", "tuxes", "tuyer", "twaes", "twain", "twang", "twats", "tweak", "tweed", "tween", "tweet", "twerp", "twice", "twier", "twigs", "twill", "twine", "twins", "twiny", "twirl", "twirp", "twist", "twits", "twixt", "twyer", "tyees", "tyers", "tying", "tykes", "tyned", "tynes", "typal", "typed", "types", "typey", "typic", "typos", "typps", "tyred", "ulnad", "ulnae", "ulnar", "ulnas", "ulpan", "ultra", "ulvas", "umami", "umbel", "umber", "umbos", "umbra", "umiac", "umiak", "umiaq", "umped", "unais", "unapt", "unarm", "unary", "unaus", "unban", "unbar", "unbid", "unbox", "uncap", "uncia", "uncle", "uncos", "uncoy", "uncus", "uncut", "undee", "under", "undid", "undue", "unfed", "unfit", "unfix", "ungot", "unhat", "unhip", "unify", "union", "unite", "units", "unity", "unlay", "unled", "unlet", "unlit", "unman", "unmet", "unmew", "unmix", "unpeg", "unpen", "unpin", "unrig", "unrip", "unsay", "unset", "unsew", "unsex", "untie", "until", "unwed", "unwit", "unwon", "unzip", "upbow", "upbye", "updos", "updry", "upend", "uplit", "upped", "upper", "upset", "uraei", "urare", "urari", "urase", "urate", "urban", "urbia", "ureal", "ureas", "uredo", "ureic", "urged", "urger", "urges", "urial", "urine", "ursae", "usage", "users", "usher", "using", "usnea", "usque", "usual", "usurp", "usury", "uteri", "utile", "utter", "uveal", "uveas", "uvula", "vacua", "vagal", "vague", "vagus", "vails", "vairs", "vakil", "vales", "valet", "valid", "valor", "valse", "value", "valve", "vamps", "vampy", "vanda", "vaned", "vanes", "vangs", "vapid", "vapor", "varas", "varia", "varix", "varna", "varus", "varve", "vasal", "vases", "vasts", "vasty", "vatic", "vatus", "vault", "vaunt", "veals", "vealy", "veena", "veeps", "veers", "veery", "vegan", "vegie", "veils", "veins", "veiny", "velar", "velds", "veldt", "velum", "venae", "venal", "vends", "venge", "venin", "venom", "vents", "venue", "venus", "verbs", "verge", "verse", "verso", "verst", "verts", "vertu", "verve", "vesta", "vests", "vetch", "vexed", "vexer", "vexes", "vexil", "vials", "viand", "vibes", "vicar", "viced", "vices", "vichy", "video", "viers", "views", "viewy", "vigas", "vigia", "vigil", "vigor", "viler", "villa", "villi", "vills", "vimen", "vinal", "vinas", "vinca", "vined", "vines", "vinic", "vinos", "vinyl", "viola", "viols", "viper", "viral", "vireo", "vires", "virga", "virid", "virls", "virtu", "virus", "visas", "vised", "vises", "visit", "visor", "vista", "vitae", "vital", "vitta", "vivas", "vivid", "vixen", "vizir", "vizor", "vocal", "voces", "vodka", "vodou", "vodun", "vogie", "vogue", "voice", "voids", "voila", "voile", "volar", "voled", "voles", "volta", "volte", "volti", "volts", "volva", "vomer", "vomit", "voted", "voter", "votes", "vouch", "vowed", "vowel", "vower", "vroom", "vrouw", "vrows", "vuggs", "vuggy", "vughs", "vulgo", "vulva", "vying", "wacke", "wacko", "wacks", "wacky", "waddy", "waded", "wader", "wades", "wadis", "wafer", "waffs", "wafts", "waged", "wager", "wages", "wagon", "wahoo", "waifs", "wails", "wains", "wairs", "waist", "waits", "waive", "waked", "waken", "waker", "wakes", "waled", "waler", "wales", "walks", "walla", "walls", "wally", "waltz", "wames", "wamus", "wands", "waned", "wanes", "waney", "wanks", "wanly", "wants", "wards", "wared", "wares", "warks", "warms", "warns", "warps", "warts", "warty", "washy", "wasps", "waspy", "waste", "wasts", "watap", "watch", "water", "watts", "waugh", "wauks", "wauls", "waved", "waver", "waves", "wavey", "wawls", "waxed", "waxen", "waxer", "waxes", "weald", "weals", "weans", "wears", "weary", "weave", "webby", "weber", "wecht", "wedel", "wedge", "wedgy", "weeds", "weedy", "weeks", "weens", "weeny", "weeps", "weepy", "weest", "weets", "wefts", "weigh", "weird", "weirs", "wekas", "welch", "welds", "wells", "welly", "welsh", "welts", "wench", "wends", "wenny", "wests", "wetly", "whack", "whale", "whamo", "whams", "whang", "whaps", "wharf", "whats", "whaup", "wheal", "wheat", "wheel", "wheen", "wheep", "whelk", "whelm", "whelp", "whens", "where", "whets", "whews", "wheys", "which", "whids", "whiff", "whigs", "while", "whims", "whine", "whins", "whiny", "whips", "whipt", "whirl", "whirr", "whirs", "whish", "whisk", "whist", "white", "whits", "whity", "whizz", "whole", "whomp", "whoof", "whoop", "whops", "whore", "whorl", "whort", "whose", "whoso", "whump", "whups", "wicks", "widdy", "widen", "wider", "wides", "widow", "width", "wield", "wifed", "wifes", "wifty", "wigan", "wiggy", "wight", "wilco", "wilds", "wiled", "wiles", "wills", "willy", "wilts", "wimps", "wimpy", "wince", "winch", "winds", "windy", "wined", "wines", "winey", "wings", "wingy", "winks", "winos", "winze", "wiped", "wiper", "wipes", "wired", "wirer", "wires", "wirra", "wised", "wiser", "wises", "wisha", "wisps", "wispy", "wists", "witan", "witch", "wited", "wites", "withe", "withy", "witty", "wived", "wiver", "wives", "wizen", "wizes", "woads", "woald", "wodge", "woful", "woken", "wolds", "wolfs", "woman", "wombs", "womby", "women", "womyn", "wonks", "wonky", "wonts", "woods", "woody", "wooed", "wooer", "woofs", "wools", "wooly", "woops", "woosh", "woozy", "words", "wordy", "works", "world", "worms", "wormy", "worry", "worse", "worst", "worth", "worts", "would", "wound", "woven", "wowed", "wrack", "wrang", "wraps", "wrapt", "wrath", "wreak", "wreck", "wrens", "wrest", "wrick", "wried", "wrier", "wries", "wring", "wrist", "write", "writs", "wrong", "wrote", "wroth", "wrung", "wryer", "wryly", "wurst", "wussy", "wyled", "wyles", "wynds", "wynns", "wyted", "wytes", "xebec", "xenia", "xenic", "xenon", "xeric", "xerox", "xerus", "xylan", "xylem", "xylol", "xylyl", "xysti", "xysts", "yacht", "yacks", "yaffs", "yager", "yagis", "yahoo", "yaird", "yamen", "yamun", "yangs", "yanks", "yapok", "yapon", "yards", "yarer", "yarns", "yauds", "yauld", "yaups", "yawed", "yawls", "yawns", "yawps", "yeans", "yearn", "years", "yeast", "yecch", "yechs", "yechy", "yeggs", "yelks", "yells", "yelps", "yenta", "yente", "yerba", "yerks", "yeses", "yetis", "yetts", "yeuks", "yeuky", "yield", "yikes", "yills", "yince", "yipes", "yirds", "yirrs", "yirth", "ylems", "yobbo", "yocks", "yodel", "yodhs", "yodle", "yogas", "yogee", "yoghs", "yogic", "yogin", "yogis", "yoked", "yokel", "yokes", "yolks", "yolky", "yomim", "yonic", "yonis", "yores", "young", "yourn", "yours", "youse", "youth", "yowed", "yowes", "yowie", "yowls", "yuans", "yucas", "yucca", "yucch", "yucks", "yucky", "yugas", "yulan", "yules", "yummy", "yupon", "yurta", "yurts", "zaire", "zamia", "zanza", "zappy", "zarfs", "zaxes", "zayin", "zazen", "zeals", "zebec", "zebra", "zebus", "zeins", "zerks", "zeros", "zests", "zesty", "zetas", "zibet", "zilch", "zills", "zincs", "zincy", "zineb", "zines", "zings", "zingy", "zinky", "zippy", "ziram", "zitis", "zizit", "zlote", "zloty", "zoeae", "zoeal", "zoeas", "zombi", "zonae", "zonal", "zoned", "zoner", "zones", "zonks", "zooey", "zooid", "zooks", "zooms", "zoons", "zooty", "zoril", "zoris", "zowie", "zymes"];

var users = 0; //count the users
var playngid = [];
var scoreChanel = {};

var clients = {};
var gameovertime = 184000;
var rematch_intrested_id=[];

var currentgameplayers = [];
io.sockets.on('connection', function (socket) { // First connection
    clients[socket.id] = socket;

    users += 1; // Add 1 to the count
    reloadUsers(); // Send the count to all the users
    socket.on('message', function (argdata) { // Broadcast the message to all
        var data = argdata.data;
        var opponentsocket_id = argdata.opponentsocket_id;
        if (pseudoSet(socket)) {
            var transmit = {
                date: new Date().toISOString(),
                pseudo: returnPseudo(socket),
                sendsocketuser: socket.id,
                recieversocketuser: opponentsocket_id,
                message: data
            };
            socket.broadcast.emit('message', transmit);

        }
    });
    socket.on('setPseudo', function (userdata) { // Assign a name to the user

        var data = userdata.username;
        var udid = userdata.udid;
        
        if (pseudoArray.indexOf(data) == -1) // Test if the name is already taken
        {

            var name = data;
            socket.set('pseudo', name, function () {
                pseudoArray.push(name);
                chanels.push(socket.id);

                var data = {};
                data.id = socket.id;
                data.name = name;
                data.udid = udid;
                if (userdata.profile_pic) {
                    data.profile_pic = userdata.profile_pic;
                }else{
                    data.profile_pic = "";
                }

                //var index=socket.id;
                socketchannels.push(data);
                var pseudojson = {};
                pseudojson.status = "ok";
                pseudojson.id = socket.id;
                socket.emit('pseudoStatus', pseudojson);


            });
        } else {
            
             var pseudojson = {};
                pseudojson.status = "error";
            socket.emit('pseudoStatus', pseudojson) ;
        }
    });
    socket.on('findAllUsers', function (data) {

        io.sockets.emit('findAllUsersResponse', socketchannels);
    });
    socket.on('gameRequset', function (gamerequets) { // Assign a name to the user

        var from = gamerequets.mysocket_id;
        var to = gamerequets.userid;
        var coinfee = gamerequets.coinfee;
        if (typeof (from) != "undefined" && typeof (to) != "undefined" && typeof (from) != "undefined") {
            //code
            var ssocket = clients[to];
            var index = currentgameplayers.indexOf(to);
            if (index == -1) {

                var fromindex = "";
                var toindex = "";
                var fromname = "";
                var toname = "";
                for (var i in socketchannels) {
                    if (socketchannels[i].id == from) {
                        fromname = socketchannels[i].name;
                        var pseudo = (socketchannels[i].name);
                        var fromindex = pseudoArray.indexOf(pseudo);
                    } else if (socketchannels[i].id == to) {
                        toname = socketchannels[i].name;
                        var pseudo = (socketchannels[i].name);
                        var toindex = pseudoArray.indexOf(pseudo);
                    }



                    if (pseudoSet(socket)) {

                        //socket.broadcast.emit('message', "testing");

                    }



                }
                //socket.broadcast.emit('gameRequstinvitaion', fromname,from,to,toname,coinfee);
                var resdta = {};
                resdta.fromname = fromname;
                resdta.from = from;
                resdta.to = to;
                resdta.toname = toname;
                resdta.coinfee = coinfee;
                if (typeof (ssocket) != "undefined") {
                    ssocket.emit('gameRequstinvitaion', resdta);
                }

            } else {
                var resdta = {};
                resdta.from = from;
                resdta.to = to;

                socket.emit('playingResponseBusy', resdta);
            }
        }




    });
    
    
       socket.on('gameTimer', function (argdata) {
        var socket_id = argdata.mysocket_id;
        var from = argdata.opponentsocket_id;
        var opponenttype = argdata.opponenttype;
        var schanel = argdata.schanel;
        var digital_clock_time="";
        var minute = 1;
        var second = 60;
        var seconddisp = 60;
        var cnt = 0;
        if (typeof (socket_id) != "undefined" && typeof (from) != "undefined" && typeof (opponenttype) != "undefined" && typeof (schanel) != "undefined") {
            if (opponenttype == "real") {
                var jsonarg = {};
                jsonarg.scorechanel = scoreChanel[schanel];
                jsonarg.socket_id = socket_id;
                jsonarg.from = from;
                jsonarg.gameover = "Game Over";
               // io.sockets.emit('gameTimer', jsonarg);
               digital_clock_time = setInterval(function () {
                var test=chanels.indexOf(socket_id); var test1=chanels.indexOf(from);
                var validation= (test == -1) ? false : (test1 == -1) ? false : true;
                if (validation) {
                    if (second > 1) {
                                                                                  second = second - 1;
                                                                                  seconddisp = second;
                                                                                  if (second < 10) {
                                                                                  seconddisp = "0" + second;
                                                                                  }
                                                                                  } else if (second == 1) {
                                                                                  if (minute > 0) {
                                                                                  second = 60;
                                                                                  seconddisp = second;
                                                                                  minute = minute - 1;
                                                                                  } else {
                                                                                  seconddisp = "00";
                                                                                  }
                                                                                  }
                                                                                  var time = "0" + minute + ":" + seconddisp;
                                                                                  jsonarg.time=time;
                                                                                  io.sockets.emit('gameTimer', jsonarg); 
                                                                                  if (time == "00:00") {
                                                                                  clearInterval(digital_clock_time);
                                                                                   io.sockets.emit('playingOver', jsonarg);
                                                                                            var index = currentgameplayers.indexOf(socket_id);
                                                                            
                                                                                            if (index != -1) {
                                                                                                currentgameplayers.splice(index, 1);
                                                                                            }
                                                                                            var index1 = currentgameplayers.indexOf(from);
                                                                                            if (index1 != -1) {
                                                                                                currentgameplayers.splice(index1, 1);
                                                                                            }

                                                                                                 

                                                                                  }
                }else{
                  clearInterval(digital_clock_time);  
                }
                                                               
                                                                                  
                                                                                  }, 1000);
                

            } else if (opponenttype == "virtual") {

                var jsonarg = {};
                jsonarg.scorechanel = scoreChanel[schanel];
                jsonarg.socket_id = socket_id;
                jsonarg.from = from;

                 digital_clock_time = setInterval(function () {
                                                        
                                                               if (second > 1) {
                                                                                  second = second - 1;
                                                                                  seconddisp = second;
                                                                                  if (second < 10) {
                                                                                  seconddisp = "0" + second;
                                                                                  }
                                                                                  } else if (second == 1) {
                                                                                  if (minute > 0) {
                                                                                  second = 60;
                                                                                  seconddisp = second;
                                                                                  minute = minute - 1;
                                                                                  } else {
                                                                                  seconddisp = "00";
                                                                                  }
                                                                                  }
                                                                                  var time = "0" + minute + ":" + seconddisp;
                                                                                  jsonarg.time=time;
                                                                                  socket.emit('gameTimer', jsonarg);
                                                                                  
                                                                                  if (time == "00:00") {
                                                                                  clearInterval(digital_clock_time);
                                                                                   
                                                                                            socket.emit('playingOver', jsonarg);
                                                                                            var index = currentgameplayers.indexOf(socket_id);

                                                                                                if (index != -1) {
                                                                                                    currentgameplayers.splice(index, 1);
                                                                                                }
                                                                                                var index1 = currentgameplayers.indexOf(from);
                                                                                                if (index1 != -1) {
                                                                                                    currentgameplayers.splice(index1, 1);
                                                                                                }
                                                                                                  

                                                                                  }
                                                                                  
                                                                                  }, 1000);
                

            }
        }



    });

    socket.on('reqplayingOver', function (argdata) {
        var socket_id = argdata.mysocket_id;
        var from = argdata.opponentsocket_id;
        var opponenttype = argdata.opponenttype;
        var schanel = argdata.schanel;
        if (typeof (socket_id) != "undefined" && typeof (from) != "undefined" && typeof (opponenttype) != "undefined" && typeof (schanel) != "undefined") {
            if (opponenttype == "real") {
                var jsonarg = {};
                jsonarg.scorechanel = scoreChanel[schanel];
                jsonarg.socket_id = socket_id;
                jsonarg.from = from;
                jsonarg.gameover = "Game Over";
                io.sockets.emit('playingOver', jsonarg);
                var index = currentgameplayers.indexOf(socket_id);

                if (index != -1) {
                    currentgameplayers.splice(index, 1);
                }
                var index1 = currentgameplayers.indexOf(from);
                if (index1 != -1) {
                    currentgameplayers.splice(index1, 1);
                }

            } else if (opponenttype == "virtual") {

                var jsonarg = {};
                jsonarg.scorechanel = scoreChanel[schanel];
                jsonarg.socket_id = socket_id;
                jsonarg.from = from;

                socket.emit('playingOver', jsonarg);
                var index = currentgameplayers.indexOf(socket_id);

                if (index != -1) {
                    currentgameplayers.splice(index, 1);
                }
                var index1 = currentgameplayers.indexOf(from);
                if (index1 != -1) {
                    currentgameplayers.splice(index1, 1);
                }

            }
        }



    });
    socket.on('otherUserLeft', function (argdata) {
        var socket_id = argdata.mysocket_id;
        var from = argdata.opponentsocket_id;
        var opponenttype = argdata.opponenttype;
        var schanel = argdata.schanel;
        if (typeof (socket_id) != "undefined" && typeof (from) != "undefined" && typeof (opponenttype) != "undefined" && typeof (schanel) != "undefined") {
            if (opponenttype == "real") {
                var jsonarg = {};
                jsonarg.scorechanel = scoreChanel[schanel];
                jsonarg.socket_id = socket_id;
                jsonarg.from = from;
                jsonarg.gameover = "Game Over";
                io.sockets.emit('GameDiscard', jsonarg);
                var index = currentgameplayers.indexOf(socket_id);

                if (index != -1) {
                    currentgameplayers.splice(index, 1);
                }
                var index1 = currentgameplayers.indexOf(from);
                if (index1 != -1) {
                    currentgameplayers.splice(index1, 1);
                }

            }
        }



    });

    socket.on('agrrePlay', function (argdata) {


        var socket_id = argdata.mysocket_id;
        var from = argdata.opponentsocket_id;
        var opponenttype = argdata.opponenttype;
        var letter_Bag = argdata.letter_Bag;

        var ssocket = clients[from];
        var index = currentgameplayers.indexOf(from);
        if (opponenttype == "real") {

            if (index == -1) {
                currentgameplayers.push(socket_id);
                currentgameplayers.push(from);
                var timestamp = Math.round(+new Date() / 1000);
                var playid = socket_id + "_" + from + "_" + timestamp;

                playngid.push(playid);
                var schanel = playid;
                scoreChanel[schanel] = {};


                scoreChanel[schanel][socket_id] = {
                    "score": 0,
                    letterbag: letter_Bag
                };
                scoreChanel[schanel][from] = {
                    "score": 0,
                    letterbag: letter_Bag
                };
                var newbag = letter_Bag;
                var rno = randomInt(0, fiveletterwords.length - 1);
                var fiveletterword = (fiveletterwords[rno]);
                fiveletterword = fiveletterword.toUpperCase();

                for (var l = 0; l < fiveletterword.length; l++) {
                    var letter = fiveletterword.substring(l, l + 1);;
                    var index = newbag.indexOf(letter);
                    newbag.splice(index, 1);
                }


                var letter7array = [];
                var letter7array1 = [];
                var p = pick(14, 0, newbag.length - 1);
                var playword = [];
                for (i = 0; i < 7; i = i + 1) {
                    letter7array.push(newbag[p[i]]);
                    letter7array1.push(newbag[p[i + 7]]);
                    playword.push(newbag[p[i]]);
                    playword.push(newbag[p[i + 7]])
                }

                for (var cnt = 0; cnt < playword.length; cnt++) {
                    var letter = playword[cnt];
                    var index = newbag.indexOf(letter);
                    newbag.splice(index, 1);

                }



                scoreChanel[schanel][socket_id].letterbag = newbag;
                scoreChanel[schanel][from].letterbag = newbag;


                var datatosend = {};
                datatosend.agree = "agree";
                datatosend.socket_id = socket_id;
                datatosend.from = from;
                datatosend.playid = playid;
                datatosend.schanel = schanel;
                datatosend.fiveletterword = fiveletterword;
                datatosend.opponenttype = opponenttype;
                datatosend.letter7array = letter7array;
                datatosend.letter7array1 = letter7array1;
                datatosend.letterbag = scoreChanel[schanel][socket_id].letterbag;



                // io.sockets.emit('playingResponse', "agree",socket_id,from,playid,schanel,fiveletterword,opponenttype,letter7array,letter7array1,scoreChanel[schanel][socket_id].letterbag);
                socket.emit('playingResponse', datatosend);
                ssocket.emit('playingResponse', datatosend);


                /* setTimeout(function(){
				var jsonarg={};
				jsonarg.scorechanel=scoreChanel[schanel];
				jsonarg.socket_id=socket_id;
				jsonarg.from=from;
				jsonarg.gameover="Game Over";
				io.sockets.emit('playingOver', jsonarg);
				 var index=currentgameplayers.indexOf(socket_id);
				
				 if (index!=-1) {
					   currentgameplayers.splice(index,1);
				 }
				 var index1=currentgameplayers.indexOf(from);
				 if (index1!=-1) {
					   currentgameplayers.splice(index1,1);
				 }
				
				},gameovertime);*/

            } else {
                var busydata = {};
                busydata.from = socket_id;
                busydata.to = from;
                socket.emit('playingResponseBusy', busydata);
            }

        } else if (opponenttype == "virtual") {

            currentgameplayers.push(socket_id);

            var timestamp = Math.round(+new Date() / 1000);
            var playid = socket_id + "_" + from + "_" + timestamp;

            playngid.push(playid);
            var schanel = playid;
            scoreChanel[schanel] = {};


            scoreChanel[schanel][socket_id] = {
                "score": 0,
                "letterbag": letter_Bag
            };
            scoreChanel[schanel][from] = {
                "score": 0,
                "letterbag": letter_Bag
            };

            var newbag = letter_Bag;
            var rno = randomInt(0, fiveletterwords.length - 1);
            var fiveletterword = (fiveletterwords[rno]);
            fiveletterword = fiveletterword.toUpperCase();


            for (var l = 0; l < fiveletterword.length; l++) {
                var letter = fiveletterword.substring(l, l + 1);;
                var index = newbag.indexOf(letter);
                newbag.splice(index, 1);
            }


            var letter7array = [];
            var letter7array1 = [];
            var p = pick(14, 0, newbag.length - 1);
            var playword = [];
            for (i = 0; i < 7; i = i + 1) {
                letter7array.push(newbag[p[i]]);
                letter7array1.push(newbag[p[i + 7]]);
                playword.push(newbag[p[i]]);
                playword.push(newbag[p[i + 7]])
            }

            for (var cnt = 0; cnt < playword.length; cnt++) {
                var letter = playword[cnt];
                var index = letter_Bag.indexOf(letter);
                newbag.splice(index, 1);

            }




            scoreChanel[schanel][socket_id].letterbag = newbag;
            scoreChanel[schanel][from].letterbag = newbag;


            var datatosend = {};
            datatosend.agree = "agree";
            datatosend.socket_id = socket_id;
            datatosend.from = from;
            datatosend.playid = playid;
            datatosend.schanel = schanel;
            datatosend.fiveletterword = fiveletterword;
            datatosend.opponenttype = opponenttype;
            datatosend.letter7array = letter7array;
            datatosend.letter7array1 = letter7array1;
            datatosend.letterbag = scoreChanel[schanel][socket_id].letterbag;


            socket.emit('playingResponse', datatosend);

            /* setTimeout(function(){
				var jsonarg={};
				jsonarg.scorechanel=scoreChanel[schanel];
				jsonarg.socket_id=socket_id;
				jsonarg.from=from;
				socket.emit('playingOver',jsonarg);
				 var index=currentgameplayers.indexOf(socket_id);
				
				 if (index!=-1) {
					   currentgameplayers.splice(index,1);
				 }
				 var index1=currentgameplayers.indexOf(from);
				 if (index1!=-1) {
					   currentgameplayers.splice(index1,1);
				 }
				
				},gameovertime);*/


        }




    });
    socket.on('discardPlay', function (discarddata) {
        var socket_id = discarddata.mysocket_id;
        var from = discarddata.from;
        var ssocket = clients[from];
        var datatosend = {};
        datatosend.agree = "discard";
        datatosend.socket_id = socket_id;
        datatosend.from = from;
        datatosend.playid = "";
        datatosend.schanel = "";
        datatosend.fiveletterword = "";
        datatosend.opponenttype = "";
        datatosend.letter7array = "";
        datatosend.letter7array1 = "";
        datatosend.letterbag = "";
        if (typeof (ssocket) != "undefined") {
            ssocket.emit('playingResponse', datatosend);
        }


    });
    socket.on('swaprack', function (swapdata) {

        var socket_id = swapdata.mysocket_id;
        var opponentsocket_id = swapdata.opponentsocket_id;
        var schanel = swapdata.scoreChanel;
        var reqdecoy = swapdata.decoyid;
        var reqdecoyusedlet = swapdata.decoyletter;
        if (scoreChanel[schanel] && scoreChanel[schanel][socket_id]) {
            var currentletbag = scoreChanel[schanel][socket_id].letterbag;
            if (currentletbag.length > 0) {
                
               
                for (var j = 0; j < reqdecoyusedlet.length; j++) {
                    currentletbag.push(reqdecoyusedlet[j]);
                }
                
              

                var p = pick(reqdecoy.length, 0, currentletbag.length - 1);
                var reqdecoyletters = [];

                if (currentletbag.length >= p.length) {
                    for (i = 0; i < p.length; i = i + 1) {
                        reqdecoyletters.push(currentletbag[p[i]]);
                       
                    }
                   
                    for (l = 0; l < reqdecoyletters.length; l = l + 1) {

                        var letter = reqdecoyletters[l];
                        var index = currentletbag.indexOf(letter);
                        
                        currentletbag.splice(index, 1);

                    }


                }
		

                scoreChanel[schanel][socket_id].letterbag = currentletbag;
                scoreChanel[schanel][opponentsocket_id].letterbag = currentletbag;
                var swapresponse = {};
                swapresponse.reqdecoy = reqdecoy;
                swapresponse.reqdecoyletters = reqdecoyletters;

                socket.emit('swaprackResponse', swapresponse);

            }
        }




    });
    socket.on('submitPlay', function (sendingdata) {

        var socket_id = sendingdata.mysocket_id;
        var opponentsocket_id = sendingdata.opponentsocket_id;
        var current_playername = sendingdata.myusername;
        var opponentusername = sendingdata.opponentusername;
        var current_playing_id = sendingdata.current_playing_id;
        var connectedwords = sendingdata.connectedwords;
        
         var sapce = connectedwords.startpoint;
        var res = sapce.substring(6, sapce.length);
        
    var res1 = res.split("_");
    var startCol = parseInt(res1[0]);
    var startRow = parseInt(res1[1]);
    connectedwords.startCol=startCol;
    connectedwords.startRow=startRow;
        var schanel = sendingdata.current_scoreChanel;
        var opponenttype = sendingdata.opponenttype;
        var reqdecoy = sendingdata.reqdecoy;
        var letterused = sendingdata.letterused;
        var ssocket = clients[opponentsocket_id];
        if (opponenttype == "real") {
            var index = playngid.indexOf(current_playing_id);
            if (index != -1) {
                if (scoreChanel[schanel] && scoreChanel[schanel][socket_id]) {
                    playngid.splice(index, 1);
                    var currentletbag = scoreChanel[schanel][socket_id].letterbag;
                    var reqdecoyletters = [];
                    if (currentletbag.length >= letterused.length) {
                        var p = pick(letterused.length, 0, currentletbag.length - 1);


                        if (currentletbag.length >= p.length) {
                            for (i = 0; i < p.length; i = i + 1) {

                                reqdecoyletters.push(currentletbag[p[i]]);

                            }

                            for (j = 0; j < reqdecoyletters.length; j = j + 1) {

                                var letter = reqdecoyletters[j];
                                var index = currentletbag.indexOf(letter);
                                currentletbag.splice(index, 1);

                            }




                        }


                    }else{
			if (currentletbag.length >=1) {
				 var p = pick(currentletbag.length, 0, currentletbag.length - 1);
			   for (i = 0; i < p.length; i = i + 1) {

                                reqdecoyletters.push(currentletbag[p[i]]);

                            }

                            for (j = 0; j < reqdecoyletters.length; j = j + 1) {

                                var letter = reqdecoyletters[j];
                                var index = currentletbag.indexOf(letter);
                                currentletbag.splice(index, 1);

                            }
			 }
		    }


                    if (scoreChanel[schanel][socket_id]) {
                        scoreChanel[schanel][socket_id].letterbag = currentletbag;
                    }
                    if (scoreChanel[schanel][opponentsocket_id]) {
                        scoreChanel[schanel][opponentsocket_id].letterbag = currentletbag;
                    }




                    var timestamp = Math.round(+new Date() / 1000);
                    var playid = socket_id + "_" + opponentsocket_id + "_" + timestamp;

                    playngid.push(playid);
                    scoreChanel[schanel][socket_id].score = parseInt(scoreChanel[schanel][socket_id].score) + parseInt(connectedwords.playpoints);



                    var submitresponse = {};
                    submitresponse.socket_id = socket_id;
                    submitresponse.opponentsocket_id = opponentsocket_id;
                    submitresponse.current_playername = current_playername;
                    submitresponse.current_playing_id = current_playing_id;
                    submitresponse.connectedwords = connectedwords;
                    submitresponse.playid = playid;
                    submitresponse.scorechanel = scoreChanel[schanel];
                    submitresponse.reqdecoy = reqdecoy;
                    submitresponse.reqdecoyletters = reqdecoyletters;
                    submitresponse.letterBag = scoreChanel[schanel][socket_id].letterbag;

                    socket.emit('submitPlayResponse', submitresponse);
                    ssocket.emit('submitPlayResponse', submitresponse);
                }


            } else {
                var index1 = pseudoArray.indexOf(opponentusername);

                if (index1 == -1) {
                    //code
                    var message = opponentusername + " goes offline";
                    //socket.emit('submitPlayResponseError',message);
                }
            }

        } else if (opponenttype == "virtual") {

            var index = playngid.indexOf(current_playing_id);
            if (index != -1) {


                if (scoreChanel[schanel] && scoreChanel[schanel][socket_id]) {
                    playngid.splice(index, 1);
                    var currentletbag = scoreChanel[schanel][socket_id].letterbag;
                    var reqdecoyletters = [];
                    if (currentletbag.length >= letterused.length) {
                        var p = pick(letterused.length, 0, currentletbag.length - 1);


                        if (currentletbag.length >= p.length) {
                            for (i = 0; i < p.length; i = i + 1) {

                                reqdecoyletters.push(currentletbag[p[i]]);

                            }

                            for (j = 0; j < reqdecoyletters.length; j = j + 1) {

                                var letter = reqdecoyletters[j];
                                var index = currentletbag.indexOf(letter);
                                currentletbag.splice(index, 1);

                            }




                        }


                    }else{
			 if (currentletbag.length >=1) {
				 var p = pick(currentletbag.length, 0, currentletbag.length - 1);
			   for (i = 0; i < p.length; i = i + 1) {

                                reqdecoyletters.push(currentletbag[p[i]]);

                            }

                            for (j = 0; j < reqdecoyletters.length; j = j + 1) {

                                var letter = reqdecoyletters[j];
                                var index = currentletbag.indexOf(letter);
                                currentletbag.splice(index, 1);

                            }
			 }
			
		    }



                    if (scoreChanel[schanel][socket_id]) {
                        scoreChanel[schanel][socket_id].letterbag = currentletbag;
                    }
                    if (scoreChanel[schanel][opponentsocket_id]) {
                        scoreChanel[schanel][opponentsocket_id].letterbag = currentletbag;
                    }


                    var timestamp = Math.round(+new Date() / 1000);
                    var playid = socket_id + "_" + opponentsocket_id + "_" + timestamp;

                    playngid.push(playid);
                    scoreChanel[schanel][socket_id].score = parseInt(scoreChanel[schanel][socket_id].score) + parseInt(connectedwords.playpoints);
                    console.log("playid send last time="+playid);
                    var submitresponse = {};
                    submitresponse.socket_id = socket_id;
                    submitresponse.opponentsocket_id = opponentsocket_id;
                    submitresponse.current_playername = current_playername;
                    submitresponse.current_playing_id = current_playing_id;
                    submitresponse.connectedwords = connectedwords;
                    submitresponse.playid = playid;
                    submitresponse.scorechanel = scoreChanel[schanel];
                    submitresponse.reqdecoy = reqdecoy;
                    submitresponse.reqdecoyletters = reqdecoyletters;
                    submitresponse.letterBag = scoreChanel[schanel][socket_id].letterbag;
                    socket.emit('submitPlayResponse', submitresponse);
                }



            } else {

               console.log("playid recieved="+current_playing_id);
               console.log("data");
               console.log(JSON.stringify(sendingdata));
                var replaydata = {};
                replaydata.socket_id = socket_id;
                replaydata.reqdecoy = reqdecoy;
                replaydata.letterused = letterused;
                socket.emit('replayAi', replaydata);
            }
        }



    });
    socket.on('placeTile', function (tileposition) {
        console.log("placing mehedi tile");
        console.log(JSON.stringify(tileposition));
        var socket_id = tileposition.mysocket_id;
        var opponentsocket_id = tileposition.opponentsocket_id;
        var current_playername = tileposition.myusername;
        var opponentusername = tileposition.opponentusername;
        var current_playing_id = tileposition.current_playing_id;
        var allWords = tileposition.allWords;
        var schanel = tileposition.current_scoreChanel;
        var opponenttype = tileposition.opponenttype;



        var ssocket = clients[opponentsocket_id];
        if (opponenttype == "real") {
            ssocket.emit('opponentPlaceTile', tileposition);

        } else if (opponenttype == "virtual") {

            socket.emit('opponentPlaceTile', tileposition);

        }
    });


    socket.on('virtualWordWrong', function (vdta) {

        var id = vdta.id;
        var opponentid = vdta.opid;;
        var schanel = vdta.current_scoreChanel;;
        var reqdecoyusedlet = vdta.children;
        if (scoreChanel[schanel] && scoreChanel[schanel][opponentid]) {
            var currentletbag = scoreChanel[schanel][opponentid].letterbag;
            if (currentletbag.length > 0) {
                for (var j = 0; j < reqdecoyusedlet.length; j++) {
                    currentletbag.push(reqdecoyusedlet[j]);
                }

                var p = pick(reqdecoyusedlet.length, 0, currentletbag.length - 1);
                var reqdecoyletters = [];

                if (currentletbag.length >= p.length) {
                    for (i = 0; i < p.length; i = i + 1) {
                        reqdecoyletters.push(currentletbag[p[i]]);
                        var letter = currentletbag[p[i]];


                    }
                    for (l = 0; l < reqdecoyletters.length; l = l + 1) {

                        var letter = reqdecoyletters[l];
                        var index = currentletbag.indexOf(letter);
                        currentletbag.splice(index, 1);
                    }


                }


                scoreChanel[schanel][id].letterbag = currentletbag;
                scoreChanel[schanel][opponentid].letterbag = currentletbag;

                var replaydta = {};
                replaydta.id = id;
                replaydta.reqdecoyletters = reqdecoyletters;
                socket.emit('replayVirtual', replaydta);
            } else {
                // socket.emit('replayVirtual', id,reqdecoyusedlet); 
            }
        }



    });
    
    
    socket.on('requestRematch', function (rematchdata) {

        var sender_id=rematchdata.id;
	var opponent_id=rematchdata.opponent_id;
	var letter_Bag=rematchdata.letter_Bag;
	
	if(rematch_intrested_id.indexOf(sender_id)==-1){
		rematch_intrested_id.push(sender_id);
	}
	
	if (rematch_intrested_id.indexOf(opponent_id)==-1) {
		//console.log("other player not click rematch yet and my socket id is"+sender_id+ "other player socket id is"+opponent_id+"and intrested rematch players id is= "+rematch_intrested_id+"and index is "+rematch_intrested_id.indexOf(opponent_id));
	}else{
		//console.log("yes other player is available");
		var socket_id = sender_id;
		var from = opponent_id;
		var opponenttype = "real";
		var letter_Bag =letter_Bag;
		var ssocket = clients[from];
		currentgameplayers.push(socket_id);
                currentgameplayers.push(from);
                var timestamp = Math.round(+new Date() / 1000);
                var playid = socket_id + "_" + from + "_" + timestamp;

                playngid.push(playid);
                var schanel = playid;
                scoreChanel[schanel] = {};


                scoreChanel[schanel][socket_id] = {
                    "score": 0,
                    letterbag: letter_Bag
                };
                scoreChanel[schanel][from] = {
                    "score": 0,
                    letterbag: letter_Bag
                };
                var newbag = letter_Bag;
                var rno = randomInt(0, fiveletterwords.length - 1);
                var fiveletterword = (fiveletterwords[rno]);
                fiveletterword = fiveletterword.toUpperCase();

                for (var l = 0; l < fiveletterword.length; l++) {
                    var letter = fiveletterword.substring(l, l + 1);;
                    var index = newbag.indexOf(letter);
                    newbag.splice(index, 1);
                }


                var letter7array = [];
                var letter7array1 = [];
                var p = pick(14, 0, newbag.length - 1);
                var playword = [];
                for (i = 0; i < 7; i = i + 1) {
                    letter7array.push(newbag[p[i]]);
                    letter7array1.push(newbag[p[i + 7]]);
                    playword.push(newbag[p[i]]);
                    playword.push(newbag[p[i + 7]])
                }

                for (var cnt = 0; cnt < playword.length; cnt++) {
                    var letter = playword[cnt];
                    var index = newbag.indexOf(letter);
                    newbag.splice(index, 1);

                }



                scoreChanel[schanel][socket_id].letterbag = newbag;
                scoreChanel[schanel][from].letterbag = newbag;


                var datatosend = {};
                datatosend.agree = "agree";
                datatosend.socket_id = socket_id;
                datatosend.from = from;
                datatosend.playid = playid;
                datatosend.schanel = schanel;
                datatosend.fiveletterword = fiveletterword;
                datatosend.opponenttype = opponenttype;
                datatosend.letter7array = letter7array;
                datatosend.letter7array1 = letter7array1;
                datatosend.letterbag = scoreChanel[schanel][socket_id].letterbag;



                // io.sockets.emit('playingResponse', "agree",socket_id,from,playid,schanel,fiveletterword,opponenttype,letter7array,letter7array1,scoreChanel[schanel][socket_id].letterbag);
                socket.emit('playingResponse', datatosend);
                ssocket.emit('playingResponse', datatosend);
	}
	
	setTimeout(function(){
		
		var index=rematch_intrested_id.indexOf(sender_id);
		if (index!=-1) {
		  rematch_intrested_id.splice(index, 1);	//code
		}
		var index1=rematch_intrested_id.indexOf(opponent_id);
		if (index1!=-1) {
		  rematch_intrested_id.splice(index1, 1);	//code
		}
		 
		
		},15000);



    });

        socket.on('denyRematch', function (denymatchdata) {
		//console.log("here is one player want to deny rematch"+denymatchdata.id);
		
		 var sender_id=denymatchdata.id;
		var opponent_id=denymatchdata.opponent_id;
		var ssocket = clients[opponent_id];
		ssocket.emit('denyRematch', denymatchdata);

	
	});
	 socket.on('nofundToPlay', function (userdata) {
		
		
		 var sender_id=userdata.mysocket_id;
		var opponent_id=userdata.opponentsocket_id;
		var ssocket = clients[opponent_id];
		ssocket.emit('nofundToPlay', userdata);

	
	});



    socket.on('disconnect', function () { // Disconnection of the client
        var index = currentgameplayers.indexOf(socket.id);
        if (index != -1) {
           // console.log("find other player to close the game");
            io.sockets.emit('userLeftGame', socket.id);
            // socket.emit('userLeftGame',socket.id); 
        }

        users -= 1;
        reloadUsers();
        if (pseudoSet(socket)) {

            var pseudo;
            socket.get('pseudo', function (err, name) {
                pseudo = name;
            });

            var index = pseudoArray.indexOf(pseudo);

            if (pseudo[index]) {
                pseudo.slice(index, 1);
            }
            if (pseudoArray[index]) {

                pseudoArray.splice(index, 1);

            }
            if (socketchannels[index]) {

                socketchannels.splice(index, 1);

            }
            if (chanels[index]) {
                chanels.splice(index, 1);
            }
            var pindex = currentgameplayers.indexOf(socket.id);
            if (pindex != -1) {
                currentgameplayers.splice(pindex, 1);
            }



        }
        io.sockets.emit('findAllUsersResponse', socketchannels);
    });




});

function reloadUsers() { // Send the count of the users to all
    io.sockets.emit('nbUsers', {
        "nb": users
    });
}

function pseudoSet(socket) { // Test if the user has a name
    var test;
    socket.get('pseudo', function (err, name) {
        if (name == null) test = false;
        else test = true;
    });
    return test;
}

function returnPseudo(socket) { // Return the name of the user
    var pseudo;
    socket.get('pseudo', function (err, name) {
        if (name == null) pseudo = false;
        else pseudo = name;
    });
    return pseudo;
}




function randomInt(low, high)
// Given   : low <= high
// Returns : a random integer in the range [low, high]
{
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
// removes n random elements from array this
// and returns them
Array.prototype.pick = function (n) {
    if (!n || !this.length) return [];
    var i = Math.floor(this.length * Math.random());
    return this.splice(i, 1).concat(this.pick(n - 1));
}

// returns n unique random numbers between min and max
function pick(n, min, max) {
    var a = [],
        i = max;
    while (i >= min) a.push(i--);
    return a.pick(n);
}
