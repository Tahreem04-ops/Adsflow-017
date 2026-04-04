
function rank(ad){
 return (ad.featured ? 50 : 0) + (ad.weight || 1)*10
}
module.exports = { rank }
