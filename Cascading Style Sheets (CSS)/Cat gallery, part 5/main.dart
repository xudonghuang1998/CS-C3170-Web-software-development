import 'dart:math';
import 'dart:html';

main() {
  querySelector('#new').onClick.listen(add);
}

add(e) async {
  var rnd = Random().nextDouble();
  ImageElement img = Element.img();
  img.src = 'https://cataas.com/c?type=small&t=$rnd';
  img.width = 100;
  
  var description = Element.p();
  description.text = 'description!';
  
  var cat = Element.div();
  cat.children.add(img);
  cat.children.add(description);
  cat.className = 'cat';
  
  var cats = querySelector('#cats');
  cats.children.add(cat);
}
