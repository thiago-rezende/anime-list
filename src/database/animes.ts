import { Anime } from '@models/anime'

const animes: Array<Anime> = []

function seed() {
  animes.push(Anime.build({ name: 'Neon Genesis Evangelion', slug: 'neon-genesis-evangelion', native: '新世紀エヴァンゲリオン', romaji: 'Shin Seiki Evangerion', synopsis: 'In the year 2015, the Angels, huge, tremendously powerful, alien war machines, appear in Tokyo for the second time. The only hope for Mankind\'s survival lies in the Evangelion, a humanoid fighting machine developed by NERV, a special United Nations agency. Capable of withstanding anything the Angels can dish out, the Evangelion\'s one drawback lies in the limited number of people able to pilot them. Only a handful of teenagers, all born fourteen years ago, nine months after the Angels first appeared, are able to interface with the Evangelion. One such teenager is Shinji Ikari, whose father heads the NERV team that developed and maintains the Evangelion. Thrust into a maelstrom of battle and events that he does not understand, Shinji is forced to plumb the depths of his own inner resources for the courage and strength to not only fight, but to survive, or risk losing everything.', releaseDate: new Date(1995, 10, 4) }))
  animes.push(Anime.build({ name: 'Fullmetal Alchemist: Brotherhood', slug: 'fullmetal-alchemist-brotherhood', native: '鋼の錬金術師', romaji: 'Hagane no Renkinjutsushi', synopsis: 'Alchemy is bound by this Law of Equivalent Exchange—something the young brothers Edward and Alphonse Elric only realize after attempting human transmutation: the one forbidden act of alchemy. They pay a terrible price for their transgression—Edward loses his left leg, Alphonse his physical body. It is only by the desperate sacrifice of Edward\'s right arm that he is able to affix Alphonse\'s soul to a suit of armor. Devastated and alone, it is the hope that they would both eventually return to their original bodies that gives Edward the inspiration to obtain metal limbs called "automail" and become a state alchemist, the Fullmetal Alchemist. Three years of searching later, the brothers seek the Philosopher\'s Stone, a mythical relic that allows an alchemist to overcome the Law of Equivalent Exchange. Even with military allies Colonel Roy Mustang, Lieutenant Riza Hawkeye, and Lieutenant Colonel Maes Hughes on their side, the brothers find themselves caught up in a nationwide conspiracy that leads them not only to the true nature of the elusive Philosopher\'s Stone, but their country\'s murky history as well. In between finding a serial killer and racing against time, Edward and Alphonse must ask themselves if what they are doing will make them human again... or take away their humanity.', releaseDate: new Date(2009, 4, 5) }))

  animes.forEach(anime => {
    anime.save()
  })
}

export { seed, animes }
