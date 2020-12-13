import { getHello } from "../../services/helloService.js";

const hello = ({render}) => {
  render('index.ejs', { hello: getHello() });
};
 
export { hello };