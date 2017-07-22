import * as cheerio from "cheerio";
import * as request from "request";

const URL = "https://github.com/users/dolanmiu/contributions";

export class ContributionsScraper {

    public fetch(): void {
        request(URL, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.error(error);
                console.error(body);
                return;
            }

            const $ = cheerio.load(body);
            $('span.comhead').each(function (i, element) {
                var a = $(this).prev();
                console.log(a.text());
            });
        });
    }
}