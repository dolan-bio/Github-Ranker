import * as cheerio from "cheerio";
import * as request from "request";

const URL = "https://github.com/users/dolanmiu/contributions";

export class ContributionsScraper {

    public fetch(): void {
        console.log('fetching');
        request(URL, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.error(error);
                console.error(body);
                return;
            }

            const $ = cheerio.load(body);

            const contributions: number[] = [];

            $('rect').each(function (i, element) {
                const count = $(this).attr('data-count');
                contributions.push(parseInt(count));
            });

            //console.log(contributions);
            console.log(contributions.reduce((a, b) => {
                return a + b;
            }));
        });
    }
}