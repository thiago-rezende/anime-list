import { Anime } from '@models/anime'

const animes: Array<Anime> = []

function seed() {
  animes.push(Anime.build({ name: 'Neon Genesis Evangelion', slug: 'neon-genesis-evangelion', native: '新世紀エヴァンゲリオン', romaji: 'Shin Seiki Evangerion', synopsis: 'Neon Genesis Evangelion (新世紀エヴァンゲリオン, "Shin Seiki Evangerion", lit. New Century Evangelion), commonly referred to as Evangelion, is a Japanese anime series, created by Gainax, that began in October 1995. The anime was written and directed by Hideaki Anno, and co-produced by TV Tokyo and Nihon Ad Systems (NAS). It gained international renown and won several animation awards, and was the start of the Neon Genesis Evangelion series.', releaseDate: new Date(1995, 10, 4) }))
  animes.push(Anime.build({ name: 'Fullmetal Alchemist: Brotherhood', slug: 'fullmetal-alchemist-brotherhood', native: '鋼の錬金術師', romaji: 'Hagane no Renkinjutsushi', synopsis: 'Fullmetal Alchemist: Brotherhood is the second anime adaptation developed by Bones based on the Fullmetal Alchemist manga by Hiromu Arakawa and is directed by Yasuhiro Irie and written by Hiroshi Ōnogi. It was first announced in the manga series\' 20th tankōbon volume.[1][2] The series premiered on April 5, 2009, on MBS- TBS\' Sunday 5:00 pm JST anime time block, replacing Mobile Suit Gundam 00, and ran weekly until airing its final episode on July 4, 2010. Voice actors Romi Park and Rie Kugimiya reprised their roles as main characters Edward and Alphonse Elric, respectively.[3] The series is much more similar to the manga, unlike the 2003 anime.', releaseDate: new Date(2009, 4, 5) }))

  animes.forEach(anime => {
    anime.save()
  })
}

export { seed, animes }
