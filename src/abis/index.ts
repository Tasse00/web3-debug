import ERC20 from './ERC20.json';
import ERC721 from './ERC721.json';
import ERC721Enumerable from './ERC721Enumerable.json';
import { AbiItem } from 'web3-utils';
// @ts-ignore
const ABIs = {
  ERC721: ERC721 as AbiItem[],
  ERC721Enumerable: ERC721Enumerable as AbiItem[],
  ERC20: ERC20 as AbiItem[],
};

export default ABIs;
