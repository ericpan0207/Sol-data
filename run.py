import requests
import ast
import re
import time
import traceback
from requests.adapters import HTTPAdapter, Retry
import sys

def uprint(*objects, sep=' ', end='\n', file=sys.stdout):
    enc = file.encoding
    if enc == 'UTF-8':
        print(*objects, sep=sep, end=end, file=file)
        sys.stdout.flush()
    else:
        f = lambda obj: str(obj).encode(enc, errors='backslashreplace').decode(enc)
        print(*map(f, objects), sep=sep, end=end, file=file)
        sys.stdout.flush()

# proxies = {'https': 'http://127.0.0.1:4000'}
# request = requests.get('https://www.example.net', verify=False, proxies=proxies)
express_url = 'http://localhost:4000/'
token_address = 'H1aN3vcvB68eaFPbMkoAss3vnfi4AhP5C2dpnrZzdBc7'
token_api = express_url + 'token/' +  token_address

s = requests.Session()
retries = Retry(total=5,
                backoff_factor=1,
                status_forcelist=[ 500, 502, 503, 504 ])

s.mount('http://', HTTPAdapter(max_retries=retries))


response = s.get(express_url + 'token/' +  token_address)
# response2 = requests.get(express_url + 'wallet/' + '5DsYNim41skWNmEuMRVeecHYyixToM1L8rAWWdk1WHdA')


# result2 = ast.literal_eval(response2.text)
# print(response2.text)
# for wallet in response.text:
#     print(wallet)

# convert string to 2d array
result = ast.literal_eval(response.text)

data = []
for wallet in result:
    if re.search('[1-9A-HJ-NP-Za-km-z]{32,44}', wallet[1]):
        uprint(wallet[1], wallet[3], wallet[4])

        wallet_api = express_url + 'wallet2/' + wallet[1]

        success = False
        retries = 1
        while not success and retries < 5:
            try:
                wallet_response = s.get(wallet_api)
                transfers = ast.literal_eval(wallet_response.text)
                # uprint(transfers)
                # last_transfer = transfers[-1]
                # uprint(last_transfer[3], last_transfer[4])

                sol_bal = transfers[2].split(' ')[0]
                # total txns, time_since_last_50, address, quantity, percentage, sol_bal
                row = [transfers[0], transfers[1], wallet[2], wallet[3], wallet[4], sol_bal]
                uprint(row)
                data.append(row)
                success = True
            except Exception as exc:
                # print(traceback.format_exc())
                uprint('retrying...')
                retries += 1
                continue

uprint(data)
uprint(len(data))