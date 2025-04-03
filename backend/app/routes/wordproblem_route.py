import sympy as sp #imports sympy library used for math

# def step_by_step(equationstr, variablestr): #defines a function that declares equation and variable as a string
#     x = sp.symbols(variablestr)
#     equation = sp.symbols(variablestr) # converts x into a python symbol
#     steps = [] #creates an empty list to hold steps

#     steps.append(f"Original equation: {sp.pretty(equation, use_unicode=False)}") #adds orginal equation to the lists of steps
#     #but steps are from a picture so how could i do that...

#     solution = sp.solve(equation, x) #uses sympys solve function to answer the equation

    # if else conditional branch if solution is found
if not solution:
        steps.append("No solution found.")
        
        if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

else:
    steps.append(f"Solution: {solution}")

    # add code from the github to input images

     image_file = request.files["image"]

    # Read and encode image
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

    client = anthropic.Anthropic(api_key=os.getenv('AI_ACCESS_KEY'))

   try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": "Extract the equation from the image and output it in a fully readable text format. Use words for symbols where needed to ensure clarity for a voice generator. Output ONLY the worded equation"
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": image_data
                            }
                        }
                    ]
                }
            ]
        )

        response_content = [
                block.text if hasattr(block, "text") else str(block)
                for block in message.content
        ]
        return jsonify({"response": response_content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
return steps #unsure of why the code is unreachable

  

