var questions = [
    {
        "question": "Given an array of apples. Add a new apple to the list to make it a total of 4.",
        "stage": ["apple", "apple", "apple"],
        "answer": ["apple", "apple", "apple", "apple"]
    },
    {
        "question": "Add two more to make it 6.",
        "stage": ["apple", "apple", "apple", "apple"],
        "answer": ["apple", "apple", "apple", "apple", "apple", "apple"]
    },
    {
        "question": "Add two 'mango'es to the list.",
        "stage": ["apple", "apple", "apple", "apple", "apple"],
        "answer": ["apple", "apple", "apple", "apple", "apple", "mango", "mango"]
    },
    {
        "question": "We would like to add additional details for each item, such as color, weight etc. We have updated the first one for you. Similarly modify the remaining items to match the below data.",
        "subText": "<table align='center'>  <tr>    <th>Fruit</th>    <th>Color</th>    <th>Weight</th>  </tr>  <tr>    <td>apple</td>    <td>red</td>    <td>100g</td>  </tr>  <tr>    <td>apple</td>    <td>red</td>    <td>90g</td>  </tr>  <tr>    <td>mango</td>    <td>yellow</td>    <td>150g</td>  </tr></table>",
        "stage": [{"name":"apple","color":"red","weight":"100g"},"apple","mango"],
        "answer": [{"name":"apple","color":"red","weight":"100g"},{"name":"apple","color":"red","weight":"90g"},{"name":"mango","color":"yellow","weight":"150g"}]
    }
]